export function diasParaVencer(validade: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(validade + 'T00:00:00');
  return Math.round((alvo.getTime() - hoje.getTime()) / 86400000);
}

export function brParaIso(data: string): string | null {
  const m = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mes, a] = m;
  const teste = new Date(Number(a), Number(mes) - 1, Number(d));
  if (teste.getMonth() !== Number(mes) - 1) return null; // dia inexistente
  return `${a}-${mes}-${d}`;
}