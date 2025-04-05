import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId() {
  // Função para criar um ID único baseado em tempo e aleatoriedade
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function validateEmbedCode(embedCode: string) {
  // Código vazio não é válido
  if (!embedCode || embedCode.trim() === '') {
    return false;
  }
  
  // Se for um iframe, verificar se não tem script malicioso
  if (embedCode.includes('<iframe')) {
    // Verificar se não contém scripts maliciosos
    if (embedCode.includes('<script')) {
      return false;
    }
    return true;
  }
  
  // Validar URLs diretas para vídeos
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const isDirectVideo = videoExtensions.some(ext => embedCode.toLowerCase().endsWith(ext));
  
  // Se for uma URL de vídeo direta, verificar se parece uma URL válida
  if (isDirectVideo || embedCode.includes('video') || embedCode.includes('/mp4')) {
    try {
      new URL(embedCode.startsWith('http') ? embedCode : `https://${embedCode}`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Se for uma URL que começa com http, assumir que é válida
  if (embedCode.startsWith('http')) {
    return true;
  }
  
  // Se não se encaixa em nenhum padrão conhecido, considerar inválido
  return false;
}
