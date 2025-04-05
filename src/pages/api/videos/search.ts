import type { NextApiRequest, NextApiResponse } from 'next';

// Vídeos de amostra para demonstração
const sampleVideos = [
  {
    id: 'sample1',
    title: 'Big Buck Bunny',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    description: 'Vídeo de amostra livre de direitos autorais'
  },
  {
    id: 'sample2',
    title: 'Elephant Dream',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    description: 'Outro vídeo de amostra livre de direitos autorais'
  },
  {
    id: 'sample3',
    title: 'Tears of Steel',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    description: 'Filme de curta-metragem livre de direitos autorais'
  },
  {
    id: 'sample4',
    title: 'Sintel',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    description: 'Animação livre para uso'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simular uma pesquisa com os vídeos de amostra
  const { query } = req.query;
  
  if (!query) {
    return res.status(200).json({ results: sampleVideos });
  }
  
  // Filtrar por termos de pesquisa se fornecidos
  const searchTerm = (query as string).toLowerCase();
  const filteredVideos = sampleVideos.filter(video => 
    video.title.toLowerCase().includes(searchTerm) || 
    video.description.toLowerCase().includes(searchTerm)
  );
  
  return res.status(200).json({ 
    results: filteredVideos,
    message: 'Estes são vídeos de amostra que funcionam garantidamente. Use-os como alternativa aos sites bloqueados.'
  });
} 