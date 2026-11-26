/**
 * Zero-dependency converters between legacy Gurmukhi fonts
 * (Asees, AnmolLipi, Satluj, Joy) and standard Gurmukhi Unicode.
 */
import { PunjabiFontConvertor } from "./engine.js";

/** Legacy Gurmukhi font identifiers supported by {@link convertPunjabi}. */
export type GurmukhiLegacyFont =
  | "asees"
  | "anmollipi"
  | "satluj"
  | "joy"
  | "gurbanilipi";

/** Conversion direction relative to Gurmukhi Unicode. */
export type ConversionDirection = "toUnicode" | "fromUnicode";

const UNICODE_PROFILE = "Arial Unicode MS";

const ENGINE_FONT_MAP: Record<GurmukhiLegacyFont, string> = {
  asees: "Asees",
  anmollipi: "AnmolLipi",
  satluj: "Satluj",
  joy: "Joy",
  gurbanilipi: "GurbaniLipi",
};

interface EngineApi {
  convert(input: string, toFontName: string, fromFontName: string): string;
}

const engine = PunjabiFontConvertor as unknown as EngineApi;

/**
 * Convert text between Gurmukhi Unicode and a supported legacy Gurmukhi font.
 */
export function convertPunjabi(
  text: string,
  font: GurmukhiLegacyFont,
  direction: ConversionDirection
): string {
  if (!text) return "";
  const profileName = ENGINE_FONT_MAP[font];
  if (!profileName) {
    throw new Error(`Unsupported Gurmukhi font: ${String(font)}`);
  }
  return direction === "toUnicode"
    ? engine.convert(text, UNICODE_PROFILE, profileName)
    : engine.convert(text, profileName, UNICODE_PROFILE);
}

/** Convert legacy Asees font text into Gurmukhi Unicode. */
export function aseesToUnicode(text: string): string {
  return convertPunjabi(text, "asees", "toUnicode");
}

/** Convert Gurmukhi Unicode text into legacy Asees character codes. */
export function unicodeToAsees(text: string): string {
  return convertPunjabi(text, "asees", "fromUnicode");
}

/** Convert legacy AnmolLipi font text into Gurmukhi Unicode. */
export function anmolLipiToUnicode(text: string): string {
  return convertPunjabi(text, "anmollipi", "toUnicode");
}

/** Convert Gurmukhi Unicode text into legacy AnmolLipi character codes. */
export function unicodeToAnmolLipi(text: string): string {
  return convertPunjabi(text, "anmollipi", "fromUnicode");
}

/** Convert legacy Satluj font text into Gurmukhi Unicode. */
export function satlujToUnicode(text: string): string {
  return convertPunjabi(text, "satluj", "toUnicode");
}

/** Convert Gurmukhi Unicode text into legacy Satluj character codes. */
export function unicodeToSatluj(text: string): string {
  return convertPunjabi(text, "satluj", "fromUnicode");
}

/** Convert legacy Joy font text into Gurmukhi Unicode. */
export function joyToUnicode(text: string): string {
  return convertPunjabi(text, "joy", "toUnicode");
}

/** Convert Gurmukhi Unicode text into legacy Joy character codes. */
export function unicodeToJoy(text: string): string {
  return convertPunjabi(text, "joy", "fromUnicode");
}
