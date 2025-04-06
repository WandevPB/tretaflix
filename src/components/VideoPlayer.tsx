import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Play } from 'lucide-react';
import DirectPlayer from './DirectPlayer';

interface VideoPlayerProps {
  embedCode: string;
  className?: string;
  poster?: string;
}

// Lista de vídeos de amostra garantidos
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

const VideoPlayer: React.FC<VideoPlayerProps> = ({ embedCode, className = '', poster }) => {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playerType, setPlayerType] = useState<'iframe' | 'direct' | 'sample' | 'torrent'>('direct');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSampleOptions, setShowSampleOptions] = useState(false);
  const [selectedSample, setSelectedSample] = useState<typeof SAMPLE_VIDEOS[0] | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Configurar um timeout para mostrar opções de amostra caso o vídeo demore muito para carregar
  useEffect(() => {
    // Limpar qualquer timeout existente
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Definir um novo timeout de 8 segundos para tentar carregar o vídeo
    if (loading) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("Tempo de carregamento excedido - mostrando opções de amostra");
        setLoading(false);
        setShowSampleOptions(true);
        setPlayerType('sample');
        // Selecionar um vídeo de amostra aleatório como fallback
        const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
        setSelectedSample(randomSample);
        setVideoUrl(randomSample.url);
        setError("O vídeo demorou muito para carregar. Use um vídeo de amostra garantido.");
      }, 8000); // Aumentado para 8 segundos para dar mais tempo ao carregamento
    }
    
    // Limpar o timeout quando o componente for desmontado
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [loading, attemptCount]);

  // Processamento do URL do vídeo
  useEffect(() => {
    if (!embedCode) {
      setError("Nenhum código de vídeo fornecido");
      setLoading(false);
      setShowSampleOptions(true);
      const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
      setSelectedSample(randomSample);
      setVideoUrl(randomSample.url);
      setPlayerType('sample');
      return;
    }
    
    setLoading(true);
    console.log("Processando link do vídeo:", embedCode);
    
    const code = embedCode.trim();
    
    // Verificar se é um iframe
    if (code.includes('<iframe') && code.includes('src=')) {
      console.log("Código iframe detectado");
      setPlayerType('iframe');
      // Extrair o URL do src
      const srcMatch = code.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        setVideoUrl(srcMatch[1]);
      } else {
        setVideoUrl(code);
      }
      setLoading(false);
    } 
    // Verificar se é um link magnet (torrent)
    else if (code.startsWith('magnet:')) {
      console.log("Link magnet detectado, usando direto");
      setPlayerType('direct');
      setVideoUrl(code);
      setLoading(false);
    }
    // Verificar se é uma URL direta
    else if (code.startsWith('http') || code.startsWith('https') || code.startsWith('//')) {
      console.log("URL direta detectada, tentando usar");
      
      // Verificar se é um arquivo de vídeo comum
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m3u8', '.ts'];
      const isVideoFile = videoExtensions.some(ext => code.toLowerCase().includes(ext));
      
      // Para qualquer URL, tentamos usar diretamente
      setPlayerType('direct');
      
      // Se for URL com // no início, adicionar https:
      if (code.startsWith('//')) {
        setVideoUrl(`https:${code}`);
      } else {
        setVideoUrl(code);
      }
      
      console.log("Usando URL direta:", code);
      setLoading(false);
    }
    // Para qualquer outro caso, considerar como texto de URL
    else {
      console.log("Tentando tratar como URL sem protocolo");
      // Se for texto, supor que é uma URL sem protocolo
      const urlWithProtocol = `https://${code}`;
      setPlayerType('direct');
      setVideoUrl(urlWithProtocol);
      setLoading(false);
    }

  }, [embedCode, attemptCount]);
  
  const handleIframeLoad = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setLoading(false);
  };

  const handleIframeError = () => {
    console.log("Erro ao carregar iframe - mostrando opções de amostra");
    setShowSampleOptions(true);
    setPlayerType('sample');
    const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    setSelectedSample(randomSample);
    setVideoUrl(randomSample.url);
    setLoading(false);
  };
  
  const handleVideoError = () => {
    console.log("Erro ao carregar vídeo direto - mostrando opções de amostra");
    setShowSampleOptions(true);
    setPlayerType('sample');
    const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    setSelectedSample(randomSample);
    setVideoUrl(randomSample.url);
  };
  
  // Seleção de vídeo de amostra
  const selectSampleVideo = (video: typeof SAMPLE_VIDEOS[0]) => {
    setSelectedSample(video);
    setVideoUrl(video.url);
    setPlayerType('direct');
    setShowSampleOptions(false);
  };
  
  // Botão para voltar para opções de amostra
  const backToSampleOptions = () => {
    setShowSampleOptions(true);
  };

  // Tentar novamente com o URL original
  const tryAgain = () => {
    setAttemptCount(prev => prev + 1);
    setLoading(true);
    setError(null);
    setShowSampleOptions(false);
  };
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-black ${className} aspect-video`}>
        <Loader2 className="w-8 h-8 animate-spin text-tretaflix-red" />
        <p className="ml-2 text-white">Carregando vídeo...</p>
      </div>
    );
  }
  
  if (!videoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black ${className} aspect-video text-white`}>
        <p>Não foi possível carregar o vídeo.</p>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={tryAgain}
            className="px-4 py-2 bg-tretaflix-gray hover:bg-gray-700 text-white rounded"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => setShowSampleOptions(true)}
            className="px-4 py-2 bg-tretaflix-red hover:bg-red-700 text-white rounded"
          >
            Ver vídeos de amostra
          </button>
        </div>
      </div>
    );
  }
  
  // Mostrar seleção de vídeos de amostra
  if (showSampleOptions) {
    return (
      <div className={`bg-black ${className} aspect-video flex flex-col items-center justify-center text-white p-6`}>
        <h2 className="text-xl font-semibold mb-4">Escolha um vídeo para assistir</h2>
        <p className="text-center mb-6 max-w-md">
          Escolha um dos vídeos de amostra abaixo:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {SAMPLE_VIDEOS.map((video, index) => (
            <div 
              key={index} 
              className="bg-tretaflix-gray rounded-md overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => selectSampleVideo(video)}
            >
              <div className="aspect-video relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="p-2">
                <p className="font-medium">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={tryAgain}
          className="px-4 py-2 bg-tretaflix-gray hover:bg-gray-700 text-white rounded"
        >
          Tentar com o vídeo original
        </button>
      </div>
    );
  }

  // Usa DirectPlayer para vídeos diretos e amostras
  if (playerType === 'direct' || playerType === 'sample') {
    return (
      <DirectPlayer 
        source={videoUrl} 
        className={className}
        poster={selectedSample?.thumbnail || poster}
      />
    );
  }
  
  // Player iframe (padrão)
  return (
    <div className="w-full flex flex-col">
      <div className={`${className} aspect-video bg-black`}>
        <iframe
          ref={iframeRef}
          src={videoUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
      <div className="py-3 px-4 text-center bg-tretaflix-gray/20 rounded-b-md flex flex-wrap items-center justify-between">
        <div className="text-white text-sm">
          Reproduzindo iframe
        </div>
        <button
          onClick={() => backToSampleOptions()}
          className="px-3 py-1 text-sm bg-tretaflix-gray hover:bg-gray-700 text-white rounded"
        >
          Trocar vídeo
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer; 