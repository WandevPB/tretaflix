import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obter a URL do vídeo a partir do parâmetro de consulta
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL não fornecida ou inválida' });
    }
    
    // Decodificar a URL se estiver codificada
    const decodedUrl = decodeURIComponent(url);
    
    // Validar se a URL é permitida (opcional, mas recomendado para segurança)
    const allowedDomains = ['redecanais.gs', 'redecanais.to', 'redecanais.com'];
    const urlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : `https://${decodedUrl}`);
    
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return res.status(403).json({ error: 'Domínio não permitido' });
    }
    
    // Fazer a requisição para a URL original
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        'Referer': urlObj.origin,
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao obter o vídeo' });
    }
    
    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Passar o conteúdo da resposta
    const data = await response.blob();
    const buffer = await data.arrayBuffer();
    
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Erro no proxy de vídeo:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
} 