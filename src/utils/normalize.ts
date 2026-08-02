export const normalizeText = (text: string): string =>
  text.trim().replace(/\s+/g, ' ').toLowerCase();
