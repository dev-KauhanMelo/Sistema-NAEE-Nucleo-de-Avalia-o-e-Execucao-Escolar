export function formatarTempoRelativo(timestamp: number, agora: number = Date.now()): string {
  const diffSeg = Math.floor((agora - timestamp) / 1000);

  if (diffSeg < 5) return "agora";
  if (diffSeg < 60) return `há ${diffSeg}s`;

  const diffMin = Math.floor(diffSeg / 60);
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `há ${diffHoras}h`;

  const diffDias = Math.floor(diffHoras / 24);
  return `há ${diffDias}d`;
}
