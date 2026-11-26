import { describe, expect, it } from "vitest";
import {
  anmolLipiToUnicode,
  aseesToUnicode,
  convertPunjabi,
  joyToUnicode,
  satlujToUnicode,
  unicodeToAnmolLipi,
  unicodeToAsees,
  unicodeToJoy,
  unicodeToSatluj,
} from "../src/index.js";

describe("gurmukhi-legacy-to-unicode", () => {
  describe("Consecutive Sihari handling", () => {
    it("decodes legacy AnmolLipi consecutive Sihari words cleanly", () => {
      expect(anmolLipiToUnicode("ividAwrQI")).toBe("ਵਿਦਿਆਰਥੀ");
      expect(anmolLipiToUnicode("ieiqhws")).toBe("ਇਤਿਹਾਸ");
      expect(anmolLipiToUnicode("ivigAwn")).toBe("ਵਿਗਿਆਨ");
      expect(anmolLipiToUnicode("ikirAw")).toBe("ਕਿਰਿਆ");
    });

    it("decodes legacy Asees consecutive Sihari words cleanly", () => {
      expect(aseesToUnicode("ftfdnkoEh")).toBe("ਵਿਦਿਆਰਥੀ");
      expect(aseesToUnicode("ftfrnkB")).toBe("ਵਿਗਿਆਨ");
    });

    it("round-trips consecutive Sihari words without doubled U+0A3F artifacts", () => {
      const consecutiveSihariWords = [
        "ਵਿਦਿਆਰਥੀ",
        "ਇਤਿਹਾਸ",
        "ਵਿਗਿਆਨ",
        "ਕਿਰਿਆ",
        "ਪ੍ਰਿਥਿਵੀ",
      ];

      const pairs: Array<{
        font: string;
        encode: (text: string) => string;
        decode: (text: string) => string;
      }> = [
        { font: "asees", encode: unicodeToAsees, decode: aseesToUnicode },
        { font: "anmollipi", encode: unicodeToAnmolLipi, decode: anmolLipiToUnicode },
        { font: "satluj", encode: unicodeToSatluj, decode: satlujToUnicode },
        { font: "joy", encode: unicodeToJoy, decode: joyToUnicode },
      ];

      for (const word of consecutiveSihariWords) {
        for (const { encode, decode } of pairs) {
          const legacy = encode(word);
          const unicode = decode(legacy);
          expect(unicode).toBe(word);
          expect(unicode).not.toContain("\u0A3F\u0A3F");
        }
      }
    });
  });

  describe("Bindi, Tippi, Adhak, and Pairin conjuncts", () => {
    it("handles Bindi (ਂ) and Tippi (ੰ) across legacy fonts", () => {
      expect(anmolLipiToUnicode("kM")).toBe("ਕੰ");
      expect(anmolLipiToUnicode("kN")).toBe("ਕਂ");

      for (const word of ["ਪੰਜਾਬੀ", "ਸਿੰਘ", "ਕਾਂ"]) {
        for (const font of ["asees", "anmollipi", "satluj", "joy"] as const) {
          const encoded = convertPunjabi(word, font, "fromUnicode");
          expect(convertPunjabi(encoded, font, "toUnicode")).toBe(word);
        }
      }
    });

    it("handles Adhak (ੱ) gemination", () => {
      expect(anmolLipiToUnicode("~k")).toBe("ੱਕ");

      for (const word of ["ਸਿੱਖਿਆ", "ਮਿੱਤਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ"]) {
        expect(aseesToUnicode(unicodeToAsees(word))).toBe(word);
        expect(anmolLipiToUnicode(unicodeToAnmolLipi(word))).toBe(word);
        expect(satlujToUnicode(unicodeToSatluj(word))).toBe(word);
        expect(joyToUnicode(unicodeToJoy(word))).toBe(word);
      }
    });

    it("handles Pairin conjuncts (ਪ੍ਰ, ਪ੍ਹ, ਸ੍ਵ) and phrases", () => {
      expect(anmolLipiToUnicode("pR")).toBe("ਪ੍ਰ");
      expect(anmolLipiToUnicode("pH")).toBe("ਪ੍ਹ");
      expect(anmolLipiToUnicode("s\xcd")).toBe("ਸ੍ਵ");

      const phrases = [
        "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
        "ਪ੍ਰਿਥਵੀ",
        "ਸ੍ਵੈਮਾਣ ਅਤੇ ਪੜ੍ਹਾਈ",
        "ਕਿਤਾਬ",
      ];

      for (const phrase of phrases) {
        expect(aseesToUnicode(unicodeToAsees(phrase))).toBe(phrase);
        expect(anmolLipiToUnicode(unicodeToAnmolLipi(phrase))).toBe(phrase);
        expect(satlujToUnicode(unicodeToSatluj(phrase))).toBe(phrase);
        expect(joyToUnicode(unicodeToJoy(phrase))).toBe(phrase);
      }
    });

    it("handles known Satluj and Joy greetings", () => {
      expect(satlujToUnicode("ÃÇå ÃÌÆ ÁÕÅñ")).toBe("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ");
      expect(joyToUnicode(";fs ;Ãh nekb")).toBe("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ");
      expect(aseesToUnicode(";fs ;qh nekb")).toBe("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ");
    });

    it("returns an empty string for empty inputs", () => {
      expect(aseesToUnicode("")).toBe("");
      expect(unicodeToAsees("")).toBe("");
      expect(anmolLipiToUnicode("")).toBe("");
      expect(satlujToUnicode("")).toBe("");
      expect(joyToUnicode("")).toBe("");
    });
  });
});
