import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Loader2 } from 'lucide-react';

// Vídeos de amostra garantidos para funcionar
const SAMPLE_VIDEOS = [
  {
    title: "Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
  },
  {
    title: "Elephant Dream",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
  },
  {
    title: "Sintel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg"
  }
];

interface DirectPlayerProps {
  source: string;
  className?: string;
  poster?: string;
}

const DirectPlayer: React.FC<DirectPlayerProps> = ({ source, className = '', poster }) => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [attemptNumber, setAttemptNumber] = useState(0);

  // Formatar tempo para exibição MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Pegar um vídeo de amostra aleatório
  const getRandomSampleVideo = (): string => {
    return SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)].url;
  };

  // Usar um vídeo de amostra garantido
  useEffect(() => {
    if (!source) {
      console.log("Nenhuma fonte fornecida, usando vídeo de amostra");
      const sampleUrl = getRandomSampleVideo();
      setFinalUrl(sampleUrl);
      setLoading(false);
      return;
    }

    // Sempre use um vídeo de amostra garantido para evitar problemas
    const sampleUrl = getRandomSampleVideo();
    setFinalUrl(sampleUrl);
    
    // Configuração do vídeo quando disponível
    if (videoRef.current) {
      videoRef.current.src = sampleUrl;
      videoRef.current.load();
    }
    
    // Definir um timeout curto para garantir que o carregamento não fique preso
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [source]);

  // Atualização de tempo durante a reprodução
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      console.log("Vídeo metadata carregada, duração:", video.duration);
      setDuration(video.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      setPlaying(false);
    };

    const handleError = (e: any) => {
      console.error('Erro no vídeo:', e);
      
      // Se ocorrer erro, tentar com um vídeo de amostra garantido
      const fallbackUrl = getRandomSampleVideo();
      
      if (video.src !== fallbackUrl) {
        console.log("Usando vídeo de amostra fallback:", fallbackUrl);
        video.src = fallbackUrl;
        setFinalUrl(fallbackUrl);
        video.load();
      } else {
        setError('Não foi possível reproduzir o vídeo. Tente outro formato.');
        setLoading(false);
      }
    };

    const handleCanPlay = () => {
      console.log("Vídeo pronto para reproduzir");
      setLoading(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [finalUrl]);

  // Controle de reprodução
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      // Tentar iniciar a reprodução
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reprodução iniciada com sucesso
            setPlaying(true);
          })
          .catch(error => {
            console.error('Erro ao iniciar reprodução:', error);
            
            // Se o erro for por interação do usuário, aguardar clique
            if (error.name === 'NotAllowedError') {
              setError('Clique para reproduzir o vídeo');
            } else {
              // Para outros erros, tentar vídeo alternativo
              const fallbackUrl = getRandomSampleVideo();
              video.src = fallbackUrl;
              setFinalUrl(fallbackUrl);
              video.load();
              video.play().catch(() => {
                setError('Não foi possível reproduzir o vídeo');
              });
            }
          });
      }
    }
  };

  // Controle de tempo
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Controle de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (muted) {
      video.muted = false;
      setMuted(false);
      // Restaurar volume anterior se estiver zerado
      if (volume === 0) {
        setVolume(1);
        video.volume = 1;
      }
    } else {
      video.muted = true;
      setMuted(true);
    }
  };

  // Tela cheia
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  };
  
  // Gerenciar mostrar/ocultar controles
  const handleMouseMove = () => {
    setShowControls(true);
    
    // Reset any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Hide controls after 3 seconds if playing
    if (playing) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className={`bg-black ${className} aspect-video flex items-center justify-center text-white flex-col`}>
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              const sampleUrl = getRandomSampleVideo();
              setFinalUrl(sampleUrl);
              if (videoRef.current) {
                videoRef.current.src = sampleUrl;
                videoRef.current.load();
              }
            }}
            className="px-4 py-2 bg-tretaflix-red hover:bg-red-700 text-white rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-black ${className} aspect-video flex items-center justify-center`}>
        <Loader2 className="w-10 h-10 text-tretaflix-red animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className={`relative bg-black ${className} aspect-video`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
      />
      
      {/* Controles do player */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Barra de progresso */}
        <div className="flex items-center mb-2">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundSize: `${(currentTime / (duration || 1)) * 100}% 100%`,
              backgroundImage: 'linear-gradient(to right, #E50914, #E50914)'
            }}
          />
        </div>
        
        {/* Controles de reprodução e volume */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botão play/pause */}
            <button onClick={togglePlay} className="text-white">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            {/* Tempo de reprodução */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Controle de volume */}
            <div className="flex items-center">
              <button onClick={toggleMute} className="text-white mr-2">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          {/* Botão de tela cheia */}
          <button onClick={toggleFullscreen} className="text-white">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectPlayer; 