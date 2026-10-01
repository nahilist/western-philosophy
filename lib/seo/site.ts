export const SITE_NAME = "PHILOSOPHY Φ";
export const SITE_URL = "https://western-philosophy.vercel.app";
export const SITE_DESCRIPTION =
  "Explore Western philosophers, their major ideas, works, historical contexts, and intellectual relationships through structured courses and primary-text inquiry.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function cleanPhilosopherName(name: string) {
  return name
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (character) => character.toUpperCase());
}
