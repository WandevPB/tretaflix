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
  const [playerType, setPlayerType] = useState<'iframe' | 'direct' | 'sample'>('iframe');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSampleOptions, setShowSampleOptions] = useState(false);
  const [selectedSample, setSelectedSample] = useState<typeof SAMPLE_VIDEOS[0] | null>(null);

  // Processamento do URL do vídeo
  useEffect(() => {
    if (!embedCode) return;
    
    console.log("Processando link do vídeo:", embedCode);
    setLoading(true);

    const code = embedCode.trim();
    
    // Verificar se é um arquivo de vídeo direto
    const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.ogg', '.flv', '.wmv', '.mpg', '.mpeg', '.3gp'];
    const isDirectVideo = videoExtensions.some(ext => code.toLowerCase().endsWith(ext)) || 
                         code.includes('video') || 
                         code.includes('.mp4');
    
    if (isDirectVideo) {
      console.log("Link de vídeo direto detectado");
      setPlayerType('direct');
      setVideoUrl(code);
      setLoading(false);
      return;
    }

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
      return;
    }
    
    // Se começa com http, tratar como URL direta
    if (code.startsWith('http')) {
      console.log("URL direta detectada");
      setPlayerType('direct');
      setVideoUrl(code);
      setLoading(false);
      return;
    }
    
    // Para qualquer outro caso, mostrar opções de amostra
    console.log("Formato não reconhecido - mostrando opções de amostra");
    setShowSampleOptions(true);
    setPlayerType('sample');
    // Selecionar um vídeo de amostra aleatório como fallback
    const randomSample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    setSelectedSample(randomSample);
    setVideoUrl(randomSample.url);
    setLoading(false);

  }, [embedCode]);
  
  const handleIframeLoad = () => {
    setLoading(false);
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
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-black ${className} aspect-video`}>
        <Loader2 className="w-8 h-8 animate-spin text-tretaflix-red" />
      </div>
    );
  }
  
  if (!videoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black ${className} aspect-video text-white`}>
        <p>Não foi possível carregar o vídeo.</p>
        <button
          onClick={() => setShowSampleOptions(true)}
          className="mt-4 px-4 py-2 bg-tretaflix-red hover:bg-red-700 text-white rounded"
        >
          Ver vídeos de amostra
        </button>
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
      </div>
    );
  }

  // Player de vídeo direto (inclui vídeos de amostra)
  if (playerType === 'direct' || playerType === 'sample') {
    return (
      <div className="w-full flex flex-col">
        <div className={`${className} aspect-video bg-black`}>
          <video
            src={videoUrl}
            controls
            poster={selectedSample?.thumbnail || poster}
            className="w-full h-full"
            onLoadedData={() => setLoading(false)}
            playsInline
            autoPlay
          />
        </div>
        <div className="py-3 px-4 text-center bg-tretaflix-gray/20 rounded-b-md flex flex-wrap items-center justify-between">
          {selectedSample && (
            <div className="text-white text-sm">
              Reproduzindo: {selectedSample.title}
            </div>
          )}
          <div className="flex space-x-2 ml-auto">
            <button
              onClick={() => backToSampleOptions()}
              className="px-3 py-1 text-sm bg-tretaflix-gray hover:bg-gray-700 text-white rounded"
            >
              Trocar vídeo
            </button>
          </div>
        </div>
      </div>
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
        />
      </div>
      <div className="py-3 text-center bg-tretaflix-gray/20 rounded-b-md">
        <button
          onClick={() => backToSampleOptions()}
          className="px-4 py-2 bg-tretaflix-red hover:bg-red-700 text-white rounded"
        >
          Ver vídeos de amostra
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer; 