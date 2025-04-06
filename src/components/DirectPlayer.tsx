import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Loader2, RefreshCw } from 'lucide-react';

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
  const [usingSampleVideo, setUsingSampleVideo] = useState(false);
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
    const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    console.log("Usando vídeo de amostra:", randomSample.title);
    setUsingSampleVideo(true);
    return randomSample.url;
  };

  // Tentar usar o vídeo fornecido primeiro, com fallback para vídeo de amostra
  useEffect(() => {
    setError(null);
    setLoading(true);
    setUsingSampleVideo(false);
    
    if (!source) {
      console.log("Nenhuma fonte fornecida, usando vídeo de amostra");
      const sampleUrl = getRandomSampleVideo();
      setFinalUrl(sampleUrl);
      setLoading(false);
      return;
    }

    console.log("Tentando reproduzir vídeo com URL:", source);
    // Tentar usar a fonte original primeiro
    setFinalUrl(source);
    
    // Configuração do vídeo quando disponível
    if (videoRef.current) {
      videoRef.current.src = source;
      videoRef.current.load();
    }
    
    // Definir um timeout para fallback em caso de erro
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Timeout de carregamento, tentando vídeo de amostra");
        const sampleUrl = getRandomSampleVideo();
        setFinalUrl(sampleUrl);
        if (videoRef.current) {
          videoRef.current.src = sampleUrl;
          videoRef.current.load();
        }
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [source, attemptNumber]);

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
      
      // Se não estiver usando vídeo de amostra, tentar com um
      if (!usingSampleVideo) {
        console.log("Erro ao carregar vídeo original, usando vídeo de amostra");
        const fallbackUrl = getRandomSampleVideo();
        setFinalUrl(fallbackUrl);
        if (video) {
          video.src = fallbackUrl;
          video.load();
        }
      } else {
        // Se já está usando vídeo de amostra e ainda há erro
        setError('Não foi possível reproduzir o vídeo. Tente novamente.');
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
  }, [finalUrl, usingSampleVideo]);

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
            } else if (!usingSampleVideo) {
              // Para outros erros, tentar vídeo alternativo
              const fallbackUrl = getRandomSampleVideo();
              video.src = fallbackUrl;
              setFinalUrl(fallbackUrl);
              video.load();
              video.play().catch(() => {
                setError('Não foi possível reproduzir o vídeo');
              });
            } else {
              setError('Não foi possível reproduzir o vídeo');
            }
          });
      }
    }
  };

  // Tentar novamente com o vídeo original
  const tryAgain = () => {
    setError(null);
    setLoading(true);
    setAttemptNumber(prev => prev + 1);
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

  // Mostrar erro com opção de tentar novamente
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black ${className} aspect-video`}>
        <p className="text-white mb-4">{error}</p>
        <button
          onClick={tryAgain}
          className="px-4 py-2 bg-tretaflix-red hover:bg-red-700 text-white rounded flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black ${className} aspect-video`}>
        <Loader2 className="w-8 h-8 animate-spin text-tretaflix-red mb-2" />
        <p className="text-white">Carregando vídeo...</p>
      </div>
    );
  }

  // Render player
  return (
    <div
      ref={playerRef}
      className={`relative bg-black ${className} aspect-video overflow-hidden`}
      onMouseMove={handleMouseMove}
      onClick={() => !playing && togglePlay()}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        preload="auto"
        playsInline
      />
      
      {/* Overlay com controles */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Play/Pause central */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-tretaflix-red/80 rounded-full hover:bg-tretaflix-red transition"
        >
          {playing ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>
        
        {/* Controles inferiores */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
          {/* Progress bar */}
          <div className="flex items-center mb-2">
            <span className="text-xs text-white mr-2">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-grow h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) 100%)`
              }}
            />
            <span className="text-xs text-white ml-2">{formatTime(duration)}</span>
          </div>
          
          {/* Botões de controle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={togglePlay} className="mr-4 text-white hover:text-tretaflix-red">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center mr-4">
                <button onClick={toggleMute} className="text-white hover:text-tretaflix-red">
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="ml-2 w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #E50914 0%, #E50914 ${muted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.3) ${muted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.3) 100%)`
                  }}
                />
              </div>
              
              {usingSampleVideo && (
                <span className="text-xs text-white/70">
                  Reproduzindo vídeo de amostra
                </span>
              )}
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-tretaflix-red"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectPlayer; 