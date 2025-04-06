import React, { useState, useEffect, useRef } from 'react';
import WebTorrent from 'webtorrent';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, RefreshCw } from 'lucide-react';

interface TorrentPlayerProps {
  torrentUrl: string;
  className?: string;
  poster?: string;
}

const TorrentPlayer: React.FC<TorrentPlayerProps> = ({ torrentUrl, className = '', poster }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<WebTorrent.Instance | null>(null);
  const torrentRef = useRef<WebTorrent.Torrent | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Formatar tempo para exibição MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Formatar bytes para exibição legível
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Inicializar o cliente WebTorrent e carregar o torrent
  useEffect(() => {
    if (!torrentUrl) {
      setError('Nenhum link de torrent fornecido');
      setLoading(false);
      return;
    }
    
    const initTorrent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Criar cliente WebTorrent se não existir
        if (!clientRef.current) {
          clientRef.current = new WebTorrent();
        }
        
        // Limpar torrent anterior se existir
        if (torrentRef.current) {
          torrentRef.current.destroy();
          torrentRef.current = null;
        }
        
        // Adicionar novo torrent
        clientRef.current.add(torrentUrl, torrent => {
          torrentRef.current = torrent;
          
          // Atualizar progresso e velocidade de download
          const progressInterval = setInterval(() => {
            setProgress(torrent.progress);
            setDownloadSpeed(torrent.downloadSpeed);
          }, 1000);
          
          // Encontrar o maior arquivo de vídeo no torrent
          torrent.on('ready', () => {
            const videoFiles = torrent.files.filter(file => {
              const name = file.name.toLowerCase();
              return name.endsWith('.mp4') || name.endsWith('.webm') || 
                     name.endsWith('.mkv') || name.endsWith('.avi') || 
                     name.endsWith('.mov') || name.endsWith('.ogg');
            });
            
            if (videoFiles.length === 0) {
              setError('Nenhum arquivo de vídeo encontrado no torrent');
              setLoading(false);
              clearInterval(progressInterval);
              return;
            }
            
            // Ordenar por tamanho e pegar o maior
            const largestVideo = videoFiles.sort((a, b) => b.length - a.length)[0];
            
            // Streaming do arquivo para o elemento de vídeo
            largestVideo.renderTo(videoRef.current as HTMLMediaElement, {
              autoplay: false
            }, () => {
              setLoading(false);
              if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                  setDuration(videoRef.current?.duration || 0);
                };
              }
            });
          });
          
          torrent.on('error', err => {
            setError(`Erro ao carregar torrent: ${err.message}`);
            setLoading(false);
            clearInterval(progressInterval);
          });
          
          // Limpar intervalo quando componente for desmontado
          return () => {
            clearInterval(progressInterval);
          };
        });
        
        clientRef.current.on('error', err => {
          setError(`Erro no cliente WebTorrent: ${err.message}`);
          setLoading(false);
        });
      } catch (err: any) {
        setError(`Erro ao inicializar torrent: ${err.message}`);
        setLoading(false);
      }
    };
    
    initTorrent();
    
    // Cleanup
    return () => {
      if (torrentRef.current) {
        torrentRef.current.destroy();
      }
    };
  }, [torrentUrl]);
  
  // Atualização de tempo durante a reprodução
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleEnded = () => {
      setPlaying(false);
    };
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Controle de reprodução
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play()
        .then(() => {
          setPlaying(true);
        })
        .catch(err => {
          setError(`Não foi possível reproduzir o vídeo: ${err.message}`);
        });
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
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (playing) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };
  
  // Tentar novamente
  const tryAgain = () => {
    if (torrentRef.current) {
      torrentRef.current.destroy();
      torrentRef.current = null;
    }
    
    if (clientRef.current) {
      clientRef.current.add(torrentUrl, torrent => {
        torrentRef.current = torrent;
        setLoading(true);
        setError(null);
      });
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
        <p className="text-white mb-2">Carregando torrent... {Math.round(progress * 100)}%</p>
        {progress > 0 && (
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-tretaflix-red"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
        <p className="text-white/70 mt-2 text-sm">
          Velocidade: {formatBytes(downloadSpeed)}/s
        </p>
      </div>
    );
  }
  
  // Player
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
              
              <span className="text-xs text-white/70">
                Buffer: {Math.round(progress * 100)}% | {formatBytes(downloadSpeed)}/s
              </span>
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

export default TorrentPlayer; 