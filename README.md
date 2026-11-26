# gurmukhi-legacy-to-unicode

Zero-dependency TypeScript library for converting legacy Gurmukhi Punjabi font encodings (**Asees**, **AnmolLipi**, **Satluj**, and **Joy**) to and from standard **Gurmukhi Unicode**.

**Live browser demo:** [Convert Asees to Unicode on ConverterForAll](https://www.converterforall.com/asees-to-unicode)

## Installation

```bash
npm install gurmukhi-legacy-to-unicode
```

## Usage

```ts
import {
  aseesToUnicode,
  unicodeToAsees,
  anmolLipiToUnicode,
  satlujToUnicode,
  joyToUnicode,
} from "gurmukhi-legacy-to-unicode";

aseesToUnicode(";fs ;qh nekb");
// => "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ"

aseesToUnicode("ftfdnkoEh");
// => "ਵਿਦਿਆਰਥੀ"

anmolLipiToUnicode("ividAwrQI ieiqhws");
// => "ਵਿਦਿਆਰਥੀ ਇਤਿਹਾਸ"

satlujToUnicode("ÃÇå ÃÌÆ ÁÕÅñ");
// => "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ"

joyToUnicode(";fs ;Ãh nekb");
// => "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ"

unicodeToAsees("ਪਿਆਰ");
// => "fgnko"
```

## Why the consecutive-Sihari fix matters

In legacy Gurmukhi fonts (such as Asees, AnmolLipi, Satluj, and Joy), the short vowel sign **Sihari (`ਿ`, `U+0A3F`)** is stored *before* its consonant in visual typing order (e.g. `f + s` in Asees or `i + k` in AnmolLipi for `ਕਿ`). In Unicode, Sihari is stored logically *after* its consonant (`ਕ + ਿ`).

Many legacy JavaScript ports fail when two Sihari syllables appear back-to-back inside common Punjabi words:

- `ਵਿਦਿਆਰਥੀ` (`ਵ + ਿ` followed immediately by `ਦ + ਿ`)
- `ਇਤਿਹਾਸ` (`ਇ` followed by `ਤ + ਿ`)
- `ਵਿਗਿਆਨ` (`ਵ + ਿ` followed by `ਗ + ਿ`)
- `ਕਿਰਿਆ` (`ਕ + ਿ` followed by `ਰ + ਿ`)

In the original state machine inside `convertStringUsingMapper`:

1. When the first Sihari was encountered, it was queued in `charToAddOnRight` (`charToMoveRightIndex = 0`) to wait until one base consonant (plus any `moveAcrossCharacters` subjoined Pairin marks) was pushed.
2. When the next consonant arrived, `charToMoveRightIndex` became `1`, but when the *second* Sihari arrived right after that consonant, the non-continuing fallback branch flushed **both** `charToAddOnRight` and the incoming `charToAdd` (`output.push(charToAddOnRight, charToAdd)`), emitting `ਵਿਦ...` as `ਵ + ਿ + ਿ` (`\u0A3F\u0A3F`) and dropping Sihari from the second syllable.

This engine updates the deferred-vowel state transitions to:

- Flush `charToAddOnRight` alone (and `continue`) once a consonant has settled and a non-`moveAcrossCharacters` token starts a new cluster.
- Let subsequent `moveRightChars` tokens re-enter the queue cleanly (`charToAddOnRight = charToAdd; charToMoveRightIndex = 0`) so consecutive Sihari syllables attach to their respective consonants without doubled `\u0A3F\u0A3F` artifacts.

## API

- `aseesToUnicode(text: string): string`
- `unicodeToAsees(text: string): string`
- `anmolLipiToUnicode(text: string): string`
- `unicodeToAnmolLipi(text: string): string`
- `satlujToUnicode(text: string): string`
- `unicodeToSatluj(text: string): string`
- `joyToUnicode(text: string): string`
- `unicodeToJoy(text: string): string`
- `convertPunjabi(text: string, font: "asees" | "anmollipi" | "satluj" | "joy" | "gurbanilipi", direction: "toUnicode" | "fromUnicode"): string`

## Scope and notes

- Operates on plain strings only (no RTF, `.doc`, or PageMaker binary parsing).
- Legacy font editions and custom ligatures can vary slightly across DTP files; review domain-specific spellings or numerals against your source document.
- Try it directly in the browser without installing anything: [https://www.converterforall.com/asees-to-unicode](https://www.converterforall.com/asees-to-unicode).

## License

MIT
