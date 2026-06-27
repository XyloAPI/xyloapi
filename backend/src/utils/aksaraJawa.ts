const java2latn: Record<string, string> = {
  "ꦏ": 'ka',
  "ꦐ": 'qa', // Ka Sasak
  "ꦑ": 'kʰa', // Murda
  "ꦒ": 'ga',
  "ꦓ": 'gʰa', // Murda
  "ꦔ": 'nga', // ṅa
  "ꦕ": 'ca',
  "ꦖ": 'cʰa', // Murda
  "ꦗ": 'ja',
  "ꦘ": 'jnya', // Ja Sasak, Nya Murda
  "ꦙ": 'jʰa', // Ja Mahaprana
  "ꦚ": 'nya', // ña 
  "ꦛ": 'tha', // 'ṭa',
  "ꦜ": 'ṭʰa', // Murda
  "ꦝ": 'dha', // 'ḍa',
  "ꦞ": 'ḍʰa', // Murda
  "ꦟ": 'ṇa', // Murda
  "ꦠ": 'ta',
  "ꦡ": 'ṭa', // Murda
  "ꦢ": 'da',
  "ꦣ": 'ḍa', // Murda
  "ꦤ": 'na',
  "ꦥ": 'pa',
  "ꦦ": 'pʰa', // Murda
  "ꦧ": 'ba',
  "ꦨ": 'bʰa', // Murda
  "ꦩ": 'ma',
  "ꦪ": 'ya',
  "ꦫ": 'ra',
  "ꦬ": 'ṛa', // Ra Agung
  "ꦭ": 'la',
  "ꦮ": 'wa',
  "ꦯ": 'śa', // Murda
  "ꦰ": 'ṣa', // Sa Mahaprana
  "ꦱ": 'sa',
  "ꦲ": 'ha', // could also be "a" or any sandhangan swara
  
  "ꦁ": 'ng', // cecak
  "ꦂ": 'r', // layar
  "ꦃ": 'h', // wignyan
  "ꦄ": 'A', // swara-A
  "ꦅ": 'I', // I-Kawi -- archaic
  "ꦆ": 'I', // I
  "ꦇ": 'Ii', // Ii -- archaic
  "ꦈ": 'U', // U
  "ꦉ": 'rê', // pa cêrêk
  "ꦊ": 'lê', // nga lêlêt
  "ꦋ": 'lêu', // nga lêlêt Raswadi -- archaic
  "ꦌ": 'E', // E
  "ꦍ": 'Ai', // Ai
  "ꦎ": 'O', // O
  
  "ꦺꦴ": 'o', // taling tarung
  "ꦴ": 'a',
  "ꦶ": 'i',
  "ꦷ": 'ii',
  "ꦸ": 'u',
  "ꦹ": 'uu',
  "ꦺ": 'e',
  "ꦻ": 'ai',
  "ꦼ": 'ê',
  "ꦽ": 'rê',
  "ꦾ": 'ya',
  "ꦿ": 'ra',
  
  "ꦀ": '', // ? -- archaic
  "꦳": '\u200b', // cecak telu
  "꧀": '\u200b', // pangkon
  "꧇": '\u200b', // titik dua
  
  "꧁": '—',
  "꧂": '—',
  "꧃": '–',
  "꧄": '–',
  "꧅": '–',
  "꧆": '',
  "꧈": ',',
  "꧉": '.',
  "꧊": 'qqq',
  "꧋": '–',
  "꧌": '–',
  "꧍": '–',
  "ꧏ": '²',
  "꧐": '0',
  "꧑": '1',
  "꧒": '2',
  "꧓": '3',
  "꧔": '4',
  "꧕": '5',
  "꧖": '6',
  "꧗": '7',
  "꧘": '8',
  "꧙": '9',
  "꧞": '—',
  "꧟": '—',
  "\u200c": '#', // zero-width joiner
  "\u200b": ' ', // zero-width space
  " ": ' ' // regular space
};

export interface TransliterateOptions {
  mode?: 'ketik' | 'kopas';
  murda?: 'pakai' | 'tidak';
  diftong?: 'pakai' | 'tidak';
  spasi?: 'without' | 'with';
}

function findstr(str: string, tofind: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === tofind) return true;
  }
  return false;
}

function isDigit(a: string): boolean {
  return findstr("0123456789", a);
}

function isPunct(a: string): boolean {
  return findstr(",.><?/+=-_}{[]*&^%$#@!~`\"\\|:;()", a);
}

function isVowel(a: string): boolean {
  return findstr("aăeèéiouêěĕṚṛxôâāīūōåɔə", a);
}

function isSwara(a: string): boolean {
  return findstr("AĂEÈÉIOUXÊĚĔ", a);
}

function isConsonant(a: string): boolean {
  return findstr("BCDfGHJKLMNPQRSTVWYZbcdfghjklmnpqrstvwyzḌḍṆṇṢṣṬṭŊŋÑñɲś", a);
}

function isSpecial(a: string): boolean {
  return findstr("GgHhRrYyñnq", a);
}

function isHR(a: string): boolean {
  return findstr("HhRrŊŋ", a);
}

function isLW(a: string): boolean {
  return findstr("LlWw", a);
}

function isCJ(a: string): boolean {
  return findstr("CcJj", a);
}

function GetMatra(str: string, mode: 'ketik' | 'kopas'): string {
  let i = 0;
  if (str.length < 1) {
    return "꧀";
  }
  while (str[i] === 'h') {
    i++;
    if (i >= str.length) {
      break;
    }
  }
  if (i < str.length) {
    str = str.substring(i);
  }

  const matramap1: Record<string, string> = { "e": 'ꦺ' }; // mode ketik
  const matramap2: Record<string, string> = { "e": 'ꦼ' }; // mode kopas
  const matramap3: Record<string, string> = {
    "ā": "ꦴ", "â": "ꦴ", "aa": 'ꦴ',
    "è": 'ꦺ', "é": 'ꦺ',
    "i": 'ꦶ', "ī": "ꦷ", "ii": 'ꦷ',
    "o": 'ꦺꦴ', "ō": "ꦼꦴ",
    "u": 'ꦸ', "ū": "ꦹ", "uu": 'ꦹ',
    "x": "ꦼ", "ě": "ꦼ", "ĕ": "ꦼ", "ê": "ꦼ", "ə": "ꦼ",
    "ô": "", "ă": "", "å": "", "ɔ": "",
    "ai": 'ꦻ', "au": 'ꦻꦴ',
    "ṛ": "ꦽ", "Ṛ": "ꦽ"
  };

  const matramap = mode === 'kopas' 
    ? { ...matramap2, ...matramap3 } 
    : { ...matramap1, ...matramap3 };

  if (matramap[str] !== undefined) {
    return matramap[str];
  }
  return "";
}

function GetShift(str1: string, murdaOpt: 'pakai' | 'tidak'): { CoreSound: string | null; len: number } {
  const str = str1.toLowerCase();
  const str2 = murdaOpt === 'pakai' ? str1 : str1.toLowerCase();

  // V.1. 2nd letter of the consonant cluster is 'h'
  if (str2.indexOf("th") === 0) {
    if (str2.indexOf("thl") === 0) return { "CoreSound": "ꦛ꧀ꦭ", "len": 3 };
    else if (str2.indexOf("thr") === 0) return { "CoreSound": "ꦛꦿ", "len": 3 };
    else if (str2.indexOf("thw") === 0) return { "CoreSound": "ꦛ꧀ꦮ", "len": 3 };
    else if (str2.indexOf("thy") === 0) return { "CoreSound": "ꦛꦾ", "len": 3 };
    else return { "CoreSound": "ꦛ", "len": 2 };
  } else if (str2.indexOf("dh") === 0) {
    if (str2.indexOf("dhl") === 0) return { "CoreSound": "ꦝ꧀ꦭ", "len": 3 };
    else if (str2.indexOf("dhr") === 0) return { "CoreSound": "ꦝꦿ", "len": 3 };
    else if (str2.indexOf("dhw") === 0) return { "CoreSound": "ꦝ꧀ꦮ", "len": 3 };
    else if (str2.indexOf("dhy") === 0) return { "CoreSound": "ꦝꦾ", "len": 3 };
    else return { "CoreSound": "ꦝ", "len": 2 };
  } else if (str2.indexOf("Th") === 0) {
    if (str2.indexOf("Thl") === 0) return { "CoreSound": "ꦜ꧀ꦭ", "len": 3 };
    else if (str2.indexOf("Thr") === 0) return { "CoreSound": "ꦜꦿ", "len": 3 };
    else if (str2.indexOf("Thw") === 0) return { "CoreSound": "ꦜ꧀ꦮ", "len": 3 };
    else if (str2.indexOf("Thy") === 0) return { "CoreSound": "ꦜꦾ", "len": 3 };
    else return { "CoreSound": "ꦜ", "len": 2 };
  } else if (str2.indexOf("Dh") === 0) {
    if (str2.indexOf("Dhl") === 0) return { "CoreSound": "ꦞ꧀ꦭ", "len": 3 };
    else if (str2.indexOf("Dhr") === 0) return { "CoreSound": "ꦞꦿ", "len": 3 };
    else if (str2.indexOf("Dhw") === 0) return { "CoreSound": "ꦞ꧀ꦮ", "len": 3 };
    else if (str2.indexOf("Dhy") === 0) return { "CoreSound": "ꦞꦾ", "len": 3 };
    else return { "CoreSound": "ꦞ", "len": 2 };
  } else if (str.indexOf("ṭh") === 0) {
    if (str.indexOf("ṭhy") === 0) return { "CoreSound": "ꦜꦾ", "len": 2 };
    else if (str.indexOf("ṭhr") === 0) return { "CoreSound": "ꦜꦿ", "len": 2 };
    else return { "CoreSound": "ꦜ", "len": 2 };
  } else if (str.indexOf("ḍh") === 0) {
    if (str.indexOf("ḍhy") === 0) return { "CoreSound": "ꦞꦾ", "len": 2 };
    else if (str.indexOf("ḍhr") === 0) return { "CoreSound": "ꦞꦿ", "len": 2 };
    else return { "CoreSound": "ꦞ", "len": 2 };
  } else if (str.indexOf("kh") === 0) {
    if (str.indexOf("khl") === 0) return { "CoreSound": "ꦏ꦳꧀ꦭ", "len": 3 };
    else if (str.indexOf("khr") === 0) return { "CoreSound": "ꦏ꦳ꦿ", "len": 3 };
    else if (str.indexOf("khw") === 0) return { "CoreSound": "ꦏ꦳꧀ꦮ", "len": 3 };
    else if (str.indexOf("khy") === 0) return { "CoreSound": "ꦏ꦳ꦾ", "len": 3 };
    else return { "CoreSound": "ꦏ꦳", "len": 2 };
  } else if (str.indexOf("gh") === 0) {
    if (str.indexOf("ghl") === 0) return { "CoreSound": "ꦒ꦳꧀ꦭ", "len": 3 };
    else if (str.indexOf("ghw") === 0) return { "CoreSound": "ꦒ꦳꧀ꦮ", "len": 3 };
    else if (str.indexOf("ghr") === 0) return { "CoreSound": "ꦒ꦳ꦿ", "len": 3 };
    else if (str.indexOf("ghy") === 0) return { "CoreSound": "ꦒ꦳ꦾ", "len": 3 };
    else return { "CoreSound": "ꦒ꦳", "len": 2 };
  } else if (str.indexOf("Kh") === 0) {
    if (str.indexOf("Khl") === 0) return { "CoreSound": "ꦑ꧀ꦭ", "len": 3 };
    else if (str.indexOf("Khr") === 0) return { "CoreSound": "ꦑꦿ", "len": 3 };
    else if (str.indexOf("Khw") === 0) return { "CoreSound": "ꦑ꧀ꦮ", "len": 3 };
    else if (str.indexOf("Khy") === 0) return { "CoreSound": "ꦑꦾ", "len": 3 };
    else return { "CoreSound": "ꦑ", "len": 2 };
  } else if (str.indexOf("Gh") === 0) {
    if (str.indexOf("Ghl") === 0) return { "CoreSound": "ꦓ꧀ꦭ", "len": 3 };
    else if (str.indexOf("Ghw") === 0) return { "CoreSound": "ꦓ꧀ꦮ", "len": 3 };
    else if (str.indexOf("Ghr") === 0) return { "CoreSound": "ꦓꦿ", "len": 3 };
    else if (str.indexOf("Ghy") === 0) return { "CoreSound": "ꦓꦾ", "len": 3 };
    else return { "CoreSound": "ꦓ", "len": 2 };
  } else if (str.indexOf("ch") === 0) {
    if (str.indexOf("chl") === 0) return { "CoreSound": "ꦖ꧀ꦭ", "len": 3 };
    else if (str.indexOf("chr") === 0) return { "CoreSound": "ꦖꦿ", "len": 3 };
    else if (str.indexOf("chw") === 0) return { "CoreSound": "ꦖ꧀ꦮ", "len": 3 };
    else if (str.indexOf("chy") === 0) return { "CoreSound": "ꦖꦾ", "len": 3 };
    else return { "CoreSound": "ꦖ", "len": 2 };
  } else if (str.indexOf("jh") === 0) {
    if (str.indexOf("jhl") === 0) return { "CoreSound": "ꦙ꧀\u200bꦭ", "len": 3 };
    else if (str.indexOf("jhr") === 0) return { "CoreSound": "ꦙꦿ", "len": 3 };
    else if (str.indexOf("jhw") === 0) return { "CoreSound": "ꦙ꧀ꦮ", "len": 3 };
    else if (str.indexOf("jhy") === 0) return { "CoreSound": "ꦙꦾ", "len": 3 };
    else return { "CoreSound": "ꦙ", "len": 2 };
  } else if (str.indexOf("ph") === 0) {
    if (str.indexOf("phl") === 0) return { "CoreSound": "ꦦ꧀ꦭ", "len": 3 };
    else if (str.indexOf("phr") === 0) return { "CoreSound": "ꦦꦿ", "len": 3 };
    else if (str.indexOf("phw") === 0) return { "CoreSound": "ꦦ꧀ꦮ", "len": 3 };
    else if (str.indexOf("phy") === 0) return { "CoreSound": "ꦦꦾ", "len": 3 };
    else return { "CoreSound": "ꦦ", "len": 2 };
  } else if (str.indexOf("bh") === 0) {
    if (str.indexOf("bhl") === 0) return { "CoreSound": "ꦨ꧀ꦭ", "len": 3 };
    else if (str.indexOf("bhr") === 0) return { "CoreSound": "ꦨꦿ", "len": 3 };
    else if (str.indexOf("bhw") === 0) return { "CoreSound": "ꦨ꧀ꦮ", "len": 3 };
    else if (str.indexOf("bhy") === 0) return { "CoreSound": "ꦨꦾ", "len": 3 };
    else return { "CoreSound": "ꦨ", "len": 2 };
  } else if (str.indexOf("sh") === 0) {
    if (str.indexOf("shl") === 0) return { "CoreSound": "ꦯ꧀ꦭ", "len": 3 };
    else if (str.indexOf("shr") === 0) return { "CoreSound": "ꦯꦿ", "len": 3 };
    else if (str.indexOf("shw") === 0) return { "CoreSound": "ꦯ꧀ꦮ", "len": 3 };
    else if (str.indexOf("shy") === 0) return { "CoreSound": "ꦯꦾ", "len": 3 };
    else return { "CoreSound": "ꦯ", "len": 2 };
  } else if (str.indexOf("hh") === 0) {
    return { "CoreSound": "ꦃꦲ", "len": 2 };
  } else if (str.indexOf("rh") === 0) {
    return { "CoreSound": "ꦂꦲ", "len": 2 };
  } else if ((str2.indexOf("Ah") === 0) || (str2.indexOf("Eh") === 0) || (str2.indexOf("Ih") === 0) || (str2.indexOf("Oh") === 0) || (str2.indexOf("Uh") === 0) || (str2.indexOf("Xh") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦲ", "len": 2 };
  } else if (str2.indexOf("qh") === 0) {
    return { "CoreSound": "꧀ꦲ", "len": 2 };
  } else if (str.indexOf("h") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦲ", "len": 2 };
  }

  // V.2. 2nd letter is 'g'
  if (str.indexOf("ng") === 0) {
    if (str.indexOf("ngr") === 0) return { "CoreSound": "ꦔꦿ", "len": 3 };
    else if (str.indexOf("ngy") === 0) return { "CoreSound": "ꦔꦾ", "len": 3 };
    else if (str.indexOf("nghw") === 0) return { "CoreSound": "ꦁꦲ꧀ꦮ\u200b", "len": 4 };
    else if (str.indexOf("ngg") === 0) {
      if (str.indexOf("nggr") === 0) return { "CoreSound": "ꦔ꧀ꦒꦿ", "len": 4 };
      else if (str.indexOf("nggl") === 0) return { "CoreSound": "ꦔ꧀ꦒ꧀ꦭ", "len": 4 };
      else if (str.indexOf("nggw") === 0) return { "CoreSound": "ꦔ꧀ꦒ꧀ꦮ", "len": 4 };
      else if (str.indexOf("nggy") === 0) return { "CoreSound": "ꦔ꧀ꦒꦾ", "len": 4 };
      else return { "CoreSound": "ꦔ꧀ꦒ", "len": 3 };
    } else if (str.indexOf("ngn") === 0) {
      if (str.indexOf("ngng") === 0) return { "CoreSound": "ꦁ\u200bꦔ", "len": 4 };
      else return { "CoreSound": "ꦁ\u200bꦤ", "len": 3 };
    } else if (str.indexOf("ngh") === 0) return { "CoreSound": "ꦁ\u200bꦲ", "len": 3 };
    else if (str.indexOf("ngc") === 0) return { "CoreSound": "ꦁ\u200bꦕ", "len": 3 };
    else if (str.indexOf("ngj") === 0) return { "CoreSound": "ꦁ\u200bꦗ", "len": 3 };
    else if (str.indexOf("ngl") === 0) return { "CoreSound": "ꦔ꧀ꦭ", "len": 3 };
    else if (str.indexOf("ngw") === 0) return { "CoreSound": "ꦔ꧀ꦮ", "len": 3 };
    else return { "CoreSound": "ꦁ\u200b", "len": 2 };
  } else if (str.indexOf("gg") === 0) {
    return { "CoreSound": "ꦒ꧀ꦒ", "len": 2 };
  } else if (str.indexOf("hg") === 0) {
    return { "CoreSound": "ꦃꦒ", "len": 2 };
  } else if (str.indexOf("rg") === 0) {
    return { "CoreSound": "ꦂꦒ", "len": 2 };
  } else if ((str2.indexOf("Ag") === 0) || (str2.indexOf("Eg") === 0) || (str2.indexOf("Ig") === 0) || (str2.indexOf("Og") === 0) || (str2.indexOf("Ug") === 0) || (str2.indexOf("Xg") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦒ", "len": 2 };
  } else if (str2.indexOf("qg") === 0) {
    return { "CoreSound": "꧀ꦒ", "len": 2 };
  } else if (str.indexOf("g") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦒ", "len": 2 };
  }

  // V.3. 2nd letter is 'y'
  if (str.indexOf("ny") === 0) {
    if (str.indexOf("nyr") === 0) return { "CoreSound": "ꦚꦿ", "len": 3 };
    else if (str.indexOf("nyl") === 0) return { "CoreSound": "ꦚ꧀ꦭ", "len": 3 };
    else if (str.indexOf("nyw") === 0) return { "CoreSound": "ꦚ꧀ꦮ", "len": 3 };
    else return { "CoreSound": "ꦚ", "len": 2 };
  } else if (str.indexOf("hy") === 0) {
    return { "CoreSound": "ꦲꦾ", "len": 2 };
  } else if (str2.indexOf("ry") === 0) {
    if (str.indexOf("ryy") === 0) return { "CoreSound": "ꦂꦪꦾ", "len": 3 };
    else return { "CoreSound": "ꦂꦪ", "len": 2 };
  } else if (str2.indexOf("qy") === 0) {
    return { "CoreSound": "꧀ꦪ", "len": 2 };
  } else if (str2.indexOf("qY") === 0) {
    return { "CoreSound": "ꦾ", "len": 1 };
  } else if ((str2.indexOf("Ay") === 0) || (str2.indexOf("Ey") === 0) || (str2.indexOf("Iy") === 0) || (str2.indexOf("Oy") === 0) || (str2.indexOf("Uy") === 0) || (str2.indexOf("Xy") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦪ", "len": 2 };
  } else if (str.indexOf("y") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦾ", "len": 2 };
  }

  // V.4. 2nd letter is 'r'
  if (str.indexOf("hr") === 0) {
    return { "CoreSound": "ꦲꦿ", "len": 2 };
  } else if (str.indexOf("wr") === 0) {
    return { "CoreSound": "ꦮꦿ", "len": 2 };
  } else if (str.indexOf("rr") === 0) {
    return { "CoreSound": "ꦂꦫ", "len": 2 };
  } else if (str2.indexOf("qr") === 0) {
    return { "CoreSound": "꧀ꦫ", "len": 2 };
  } else if (str2.indexOf("qR") === 0) {
    return { "CoreSound": "ꦿ", "len": 2 };
  } else if ((str2.indexOf("Ar") === 0) || (str2.indexOf("Er") === 0) || (str2.indexOf("Ir") === 0) || (str2.indexOf("Or") === 0) || (str2.indexOf("Ur") === 0) || (str2.indexOf("Xr") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦫ", "len": 2 };
  } else if (str.indexOf("r") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦿ", "len": 2 };
  }

  // V.5. 2nd letter is 'l' or 'w'
  if (str.indexOf("hl") === 0) return { "CoreSound": "ꦃꦭ", "len": 2 };
  else if (str.indexOf("rl") === 0) return { "CoreSound": "ꦂꦭ", "len": 2 };
  else if (str.indexOf("ll") === 0) return { "CoreSound": "ꦭ꧀ꦭ", "len": 2 };
  else if (str.indexOf("ql") === 0) return { "CoreSound": "꧀ꦭ", "len": 2 };
  else if ((str2.indexOf("Al") === 0) || (str2.indexOf("El") === 0) || (str2.indexOf("Il") === 0) || (str2.indexOf("Ol") === 0) || (str2.indexOf("Ul") === 0) || (str2.indexOf("Xl") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦭ", "len": 2 };
  } else if (str.indexOf("l") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦭ", "len": 2 };
  }

  if (str.indexOf("hw") === 0) return { "CoreSound": "ꦃꦮ", "len": 2 };
  else if (str.indexOf("rw") === 0) return { "CoreSound": "ꦂꦮ", "len": 2 };
  else if (str.indexOf("ww") === 0) return { "CoreSound": "ꦮ꧀ꦮ", "len": 2 };
  else if (str.indexOf("qw") === 0) return { "CoreSound": "꧀ꦮ", "len": 2 };
  else if ((str2.indexOf("Aw") === 0) || (str2.indexOf("Ew") === 0) || (str2.indexOf("Iw") === 0) || (str2.indexOf("Ow") === 0) || (str2.indexOf("Uw") === 0) || (str2.indexOf("Xw") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦮ", "len": 2 };
  } else if (str.indexOf("w") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦮ", "len": 2 };
  }

  // V.6. 2nd letter is 'c' or 'j'
  if (str.indexOf("nc") === 0) {
    if (str.indexOf("ncr") === 0) return { "CoreSound": "ꦚ꧀ꦕꦿ", "len": 3 }; // note: bennylin's ncr returns ꦚ꧀ꦕꦿ in wiki, let's keep ꦚ꧀ꦕꦿ
    else if (str.indexOf("ncl") === 0) return { "CoreSound": "ꦚ꧀ꦕ꧀ꦭ", "len": 3 };
    else return { "CoreSound": "ꦚ꧀ꦕ", "len": 2 };
  } else if (str.indexOf("hc") === 0) return { "CoreSound": "ꦃꦕ", "len": 2 };
  else if (str.indexOf("rc") === 0) return { "CoreSound": "ꦂꦕ", "len": 2 };
  else if (str.indexOf("cc") === 0) return { "CoreSound": "ꦕ꧀ꦕ", "len": 2 };
  else if (str2.indexOf("qc") === 0) return { "CoreSound": "꧀ꦕ", "len": 2 };
  else if ((str2.indexOf("Ac") === 0) || (str2.indexOf("Ec") === 0) || (str2.indexOf("Ic") === 0) || (str2.indexOf("Oc") === 0) || (str2.indexOf("Uc") === 0) || (str2.indexOf("Xc") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦕ", "len": 2 };
  } else if (str.indexOf("c") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦕ", "len": 2 };
  }

  if (str.indexOf("nj") === 0) {
    if (str.indexOf("njr") === 0) return { "CoreSound": "ꦚ꧀ꦗꦿ", "len": 3 };
    else if (str.indexOf("njl") === 0) return { "CoreSound": "ꦚ꧀ꦗ꧀ꦭ", "len": 3 };
    else return { "CoreSound": "ꦚ꧀ꦗ", "len": 2 };
  } else if (str.indexOf("hj") === 0) return { "CoreSound": "ꦃꦗ", "len": 2 };
  else if (str.indexOf("rj") === 0) return { "CoreSound": "ꦂꦗ", "len": 2 };
  else if (str.indexOf("jj") === 0) return { "CoreSound": "ꦗ꧀ꦗ", "len": 2 };
  else if (str2.indexOf("qj") === 0) return { "CoreSound": "꧀ꦗ", "len": 2 };
  else if ((str2.indexOf("Aj") === 0) || (str2.indexOf("Ej") === 0) || (str2.indexOf("Ij") === 0) || (str2.indexOf("Oj") === 0) || (str2.indexOf("Uj") === 0) || (str2.indexOf("Xj") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦗ", "len": 2 };
  } else if (str.indexOf("j") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦗ", "len": 2 };
  }

  // V.7. 2nd letter is 'ñ' or 'n'
  if (str.indexOf("jñ") === 0) {
    if (str.indexOf("jñl") === 0) return { "CoreSound": "ꦘ꧀ꦭ", "len": 3 };
    else if (str.indexOf("jñr") === 0) return { "CoreSound": "ꦘꦿ", "len": 3 };
    else if (str.indexOf("jñw") === 0) return { "CoreSound": "ꦘ꧀ꦮ", "len": 3 };
    else if (str.indexOf("jñy") === 0) return { "CoreSound": "ꦘꦾ", "len": 3 };
    else return { "CoreSound": "ꦘ", "len": 2 };
  } else if (str.indexOf("jn") === 0) {
    if (str.indexOf("jny") === 0) {
      if (str.indexOf("jnyl") === 0) return { "CoreSound": "ꦘ꧀ꦭ", "len": 4 };
      else if (str.indexOf("jnyr") === 0) return { "CoreSound": "ꦘꦿ", "len": 4 };
      else if (str.indexOf("jnyw") === 0) return { "CoreSound": "ꦘ꧀ꦮ", "len": 4 };
      else if (str.indexOf("jnyy") === 0) return { "CoreSound": "ꦘꦾ", "len": 4 };
      else return { "CoreSound": "ꦘ", "len": 3 };
    } else {
      return { "CoreSound": "ꦗ꧀ꦤ", "len": 2 };
    }
  } else if ((str2.indexOf("bny") === 0) || (str2.indexOf("cny") === 0) || (str2.indexOf("dny") === 0) || (str2.indexOf("fny") === 0) || (str2.indexOf("gny") === 0) || (str2.indexOf("hny") === 0) || (str2.indexOf("kny") === 0) || (str2.indexOf("lny") === 0) || (str2.indexOf("mny") === 0) || (str2.indexOf("nny") === 0) || (str2.indexOf("pny") === 0) || (str2.indexOf("rny") === 0) || (str2.indexOf("sny") === 0) || (str2.indexOf("tny") === 0) || (str2.indexOf("vny") === 0) || (str2.indexOf("wny") === 0) || (str2.indexOf("zny") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦚ", "len": 3 };
  } else if (str.indexOf("hn") === 0) return { "CoreSound": "ꦃꦤ", "len": 2 };
  else if (str.indexOf("rn") === 0) return { "CoreSound": "ꦂꦤ", "len": 2 };
  else if (str.indexOf("nn") === 0) {
    if (str.indexOf("nng") === 0) return { "CoreSound": "ꦤ꧀ꦁ​", "len": 3 };
    else if (str.indexOf("nng") === 0) return { "CoreSound": "ꦤ꧀ꦚ꧀", "len": 3 };
    else return { "CoreSound": "ꦤ꧀ꦤ", "len": 2 };
  } else if (str2.indexOf("qn") === 0) return { "CoreSound": "꧀ꦤ", "len": 2 };
  else if (str.indexOf("ñ") === 1) return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦚ", "len": 2 };
  else if ((str2.indexOf("An") === 0) || (str2.indexOf("En") === 0) || (str2.indexOf("In") === 0) || (str2.indexOf("On") === 0) || (str2.indexOf("Un") === 0) || (str2.indexOf("Xn") === 0)) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "ꦤ", "len": 2 };
  } else if (str.indexOf("n") === 1) {
    return { "CoreSound": "" + GetCoreSound(str2[0], murdaOpt).CoreSound + "꧀ꦤ", "len": 2 };
  }

  if (str.indexOf("h") > 1 || str.indexOf("g") > 1 || str.indexOf("y") > 1 ||
      str.indexOf("r") > 1 || str.indexOf("l") > 1 || str.indexOf("w") > 1 ||
      str.indexOf("c") > 1 || str.indexOf("j") > 1 || str.indexOf("n") > 1 || str.indexOf("ñ") > 1) {
    let sound = "";
    let len = 0;
    let index = 0;
    for (index = 0; index < str.length; index++) {
      const c = str[index];
      if (!isVowel(c)) {
        sound += ResolveCharacterSound(c);
        len++;
      } else {
        break;
      }
    }
    return { "CoreSound": sound, "len": len };
  }

  return { "CoreSound": null, "len": 1 };
}

function GetCoreSound(str: string, murdaOpt: 'pakai' | 'tidak'): { CoreSound: string; len: number } {
  const soundMap1: Record<string, string> = {
    "A": "ꦄ", "B": "ꦧ", "C": "ꦕ", "D": "ꦢ", "E": "ꦌ", "F": "ꦥ꦳", "G": "ꦒ", "H": "ꦃ", "I": "ꦆ", "J": "ꦗ", "K": "ꦏ",
    "L": "ꦭ", "M": "ꦩ", "N": "ꦤ", "O": "ꦎ", "P": "ꦥ", "Q": "ꦐ", "R": "ꦂ", "S": "ꦱ", "T": "ꦠ", "U": "ꦈ", "V": "ꦮ꦳",
    "W": "ꦮ", "X": "ꦄꦼ", "Y": "ꦁ", "Z": "ꦰ", "Ă": 'ꦄ', "È": 'ꦌ', "É": 'ꦌ', "Ě": "ꦄꦼ", "Ĕ": "ꦄꦼ", "Ê": "ꦄꦼ",
    "ṛ": "ꦽ", "Ṛ": "ꦽ", "Ñ": "ꦚ", "Ŋ": "ꦔ", "Ṇ": "ꦟ", "Ḍ": "ꦝ", "Ṭ": "ꦛ", "Ṣ": "ꦰ"
  };

  const soundMap2: Record<string, string> = {
    "A": "ꦄ", "B": "ꦨ", "C": "ꦖ", "D": "ꦣ", "E": "ꦌ", "F": "ꦦ꦳", "G": "ꦓ", "H": "ꦲ꦳", "I": "ꦆ", "J": "ꦙ", "K": "ꦑ",
    "L": "ꦭ", "M": "ꦩ", "N": "ꦟ", "O": "ꦎ", "P": "ꦦ", "Q": "꧁", "R": "ꦬ", "S": "ꦯ", "T": "ꦡ", "U": "ꦈ", "V": "ꦮ꦳",
    "W": "ꦮ", "X": "ꦄꦼ", "Y": "ꦪ", "Z": "ꦰ", "Ă": 'ꦄ', "È": 'ꦌ', "É": 'ꦌ', "Ě": "ꦄꦼ", "Ĕ": "ꦄꦼ", "Ê": "ꦄꦼ",
    "ṛ": "ꦽ", "Ṛ": "ꦽ", "Ñ": "ꦚ", "Ŋ": "ꦔ", "Ṇ": "ꦟ", "Ḍ": "ꦝ", "Ṭ": "ꦛ", "Ṣ": "ꦰ"
  };

  const soundMap3: Record<string, string> = {
    "a": "ꦲ", "b": "ꦧ", "c": "ꦕ", "d": "ꦢ", "e": "ꦲꦺ", "f": "ꦥ꦳", "g": "ꦒ", "h": "ꦃ", "i": "ꦲꦶ", "j": "ꦗ", "k": "ꦏ",
    "l": "ꦭ", "m": "ꦩ", "n": "ꦤ", "o": "ꦲꦺꦴ", "p": "ꦥ", "q": "꧀", "r": "ꦂ", "s": "ꦱ", "t": "ꦠ", "u": "ꦲꦸ", "v": "ꦮ꦳",
    "w": "ꦮ", "x": "ꦲꦼ", "y": "ꦪ", "z": "ꦗ꦳", "Ă": 'ꦄ', "È": 'ꦌ', "É": 'ꦌ', "Ě": "ꦄꦼ", "Ĕ": "ꦄꦼ", "Ê": "ꦄꦼ",
    "ṛ": "ꦽ", "Ṛ": "ꦽ", "è": "ꦲꦺ", "é": "ꦲꦺ", "ê": "ꦲꦼ", "ě": "ꦲꦼ", "ĕ": "ꦲꦼ", "ə": "ꦲꦼ", "ɔ": "ꦲ", "å": "ꦲ",
    "ô": "ꦲ", "â": "ꦲꦴ", "ā": "ꦲꦴ", "ī": "ꦲꦷ", "ū": "ꦲꦹ", "ō": "ꦲꦼꦴ", "Ñ": "ꦚ", "ñ": "ꦚ", "ɲ": "ꦚ", "Ŋ": "ꦔ",
    "ŋ": "ꦔ", "Ṇ": "ꦟ", "ṇ": "ꦟ", "Ḍ": "ꦝ", "ḍ": "ꦝ", "Ṭ": "ꦛ", "ṭ": "ꦛ", "ś": "ꦯ", "Ṣ": "ꦰ", "ṣ": "ꦰ"
  };

  const soundMap = murdaOpt === 'pakai'
    ? { ...soundMap2, ...soundMap3 }
    : { ...soundMap1, ...soundMap3 };

  const h_shift = GetShift(str, murdaOpt);
  let core = str;

  if (h_shift.CoreSound === null) {
    if (soundMap[str.charAt(0)]) core = soundMap[str.charAt(0)];
    return {
      "CoreSound": core,
      "len": 1
    };
  } else {
    return h_shift as { CoreSound: string; len: number };
  }
}

function GetSpecialSound(str: string, murdaOpt: 'pakai' | 'tidak'): string | null {
  const specialsoundMap1: Record<string, string> = {
    "F": "ꦥ꦳꧀", "V": "ꦮ꦳꧀"
  };
  const specialsoundMap2: Record<string, string> = {
    "F": "ꦦ꦳꧀", "Q": "꧁", "V": "ꦮ꦳꧀"
  };
  const specialsoundMap3: Record<string, string> = {
    "f": "ꦥ꦳꧀", "q": "꧀", "v": "ꦮ꦳꧀", "z": "ꦗ꦳꧀"
  };

  const specialsoundMap = murdaOpt === 'pakai'
    ? { ...specialsoundMap2, ...specialsoundMap3 }
    : { ...specialsoundMap1, ...specialsoundMap3 };

  if (specialsoundMap[str] !== undefined) {
    return specialsoundMap[str];
  }
  return null;
}

function ResolveCharacterSound(c: string): string {
  const str = "" + c;
  if (isDigit(c)) {
    return "" + ('꧇' + (Number(c) - 0));
  } else if (isHR(str[0])) {
    return "" + GetCoreSound(str, 'tidak').CoreSound;
  } else if (isCJ(str[1])) {
    return "" + GetCoreSound(str, 'tidak').CoreSound + "꧀";
  } else if (isConsonant(str[0])) {
    return "" + GetCoreSound(str, 'tidak').CoreSound + "꧀";
  } else if (isSwara(str[0])) {
    return "" + GetCoreSound(str, 'tidak').CoreSound;
  } else {
    return "" + GetCoreSound(str, 'tidak').CoreSound;
  }
}

function GetSound(str: string, options: Required<TransliterateOptions>, vowelPrev: boolean): string {
  str = str.trim().replace(/\s+/g, ' ');
  const str2 = str.toLowerCase();
  if (str === null || str === "") {
    return "";
  }
  const SpecialSound = GetSpecialSound(str, options.murda);

  if (SpecialSound !== null && str.length === 1) {
    return SpecialSound;
  }
  if (str.length === 1) {
    return ResolveCharacterSound(str[0]);
  } else {
    const core_sound = GetCoreSound(str, options.murda);
    let matra = "";
    let konsonan = "";
    if (core_sound.len >= 1) {
      matra = GetMatra(str.substring(core_sound.len), options.mode);
    } else {
      matra = "";
    }

    if (str2.indexOf("nggr") === 0) {
      if (vowelPrev) konsonan = "ꦁ\u200bꦒꦿ";
      else konsonan = "ꦔ꧀ꦒꦿ";
    } else if (str2.indexOf("nggl") === 0) {
      konsonan = "ꦔ꧀ꦒ꧀ꦭ";
    } else if (str2.indexOf("nggw") === 0) {
      konsonan = "ꦔ꧀ꦒ꧀ꦮ";
    } else if (str2.indexOf("nggy") === 0) {
      konsonan = "ꦔ꧀ꦒꦾ";
    } else if (str2.indexOf("ngg") === 0) {
      if (vowelPrev) konsonan = "ꦁ\u200bꦒ";
      else konsonan = "ꦔ꧀ꦒ";
    } else if (str2.indexOf("rlx") === 0) {
      konsonan = "ꦂꦊ"; matra = "";
    } else if (str2.indexOf("rrx") === 0) {
      konsonan = "ꦂꦉ"; matra = "";
    } else if (str2.indexOf("hlx") === 0) {
      if (vowelPrev) { konsonan = "ꦃꦊ"; matra = ""; }
      else { konsonan = "ꦲ꧀ꦭꦼ"; matra = ""; }
    } else if (str2.indexOf("hrx") === 0) {
      if (vowelPrev) { konsonan = "ꦃꦉ"; matra = ""; }
      else { konsonan = "ꦲꦽ"; matra = ""; }
    } else if (str2.indexOf("qlx") === 0) {
      konsonan = "꧀ꦭꦼ"; matra = "";
    } else if (str2.indexOf("qrx") === 0) {
      konsonan = "꧀ꦫꦼ"; matra = "";
    } else if (str2.indexOf("qe") === 0) {
      konsonan = ""; matra = "ꦺ";
    } else if (str2.indexOf("qe") === 0) { // qE
      konsonan = ""; matra = "ꦻ";
    } else if (str2.indexOf("qi") === 0) {
      konsonan = ""; matra = "ꦶ";
    } else if (str2.indexOf("qi") === 0) { // qI
      konsonan = ""; matra = "ꦷ";
    } else if (str2.indexOf("qo") === 0) {
      konsonan = ""; matra = "ꦴ";
    } else if (str2.indexOf("qo") === 0) { // qO
      konsonan = ""; matra = "ꦵ";
    } else if (str2.indexOf("qu") === 0) {
      konsonan = ""; matra = "ꦸ";
    } else if (str2.indexOf("qu") === 0) { // qU
      konsonan = ""; matra = "ꦹ";
    } else if (str2.indexOf("qx") === 0) {
      konsonan = ""; matra = "ꦼ";
    } else if (str2.indexOf("qx") === 0) { // qX
      konsonan = ""; matra = "ꦽ";
    } else if (str2.indexOf("qqqqqq") === 0) { // Qqqqqq
      konsonan = ""; matra = "꧁";
    } else if (str2.indexOf("qqqqq") === 0) { // Qqqqq
      konsonan = ""; matra = "꧅";
    } else if (str2.indexOf("qqqq") === 0) { // Qqqq
      konsonan = ""; matra = "꧄";
    } else if (str2.indexOf("qqq") === 0) { // Qqq
      konsonan = ""; matra = "꧃";
    } else if (str2.indexOf("qq") === 0) { // Qq
      konsonan = ""; matra = "꧂";
    } else if (str2.indexOf("qqqqqqqq") === 0) {
      konsonan = ""; matra = "꧀";
    } else if (str2.indexOf("qqqqqqq") === 0) {
      konsonan = ""; matra = "ꧏ";
    } else if (str2.indexOf("qqqqqq") === 0) {
      konsonan = ""; matra = "꧟";
    } else if (str2.indexOf("qqqqq") === 0) {
      konsonan = ""; matra = "꧞";
    } else if (str2.indexOf("qqqq") === 0) {
      konsonan = ""; matra = "꧆";
    } else if (str2.indexOf("qqq") === 0) {
      konsonan = ""; matra = "ꦀ";
    } else if (str2.indexOf("qq") === 0) {
      konsonan = ""; matra = "꦳";
    } else if (str2.indexOf("lq") === 0) {
      konsonan = "ꦋ"; matra = "";
    } else if (str2.indexOf("iq") === 0) { // Iq
      konsonan = "ꦅ"; matra = "";
    } else if (str2.indexOf("oq") === 0) { // Oq
      konsonan = "ꦎ"; matra = "ꦀ";
    } else if (core_sound.CoreSound === "ꦂꦂꦮ") {
      if (vowelPrev) konsonan = "ꦂꦮ";
      else konsonan = "ꦫ꧀ꦮ";
    } else if (core_sound.CoreSound === "ꦃꦃꦭ") {
      if (vowelPrev) konsonan = "ꦃꦭ";
      else konsonan = "ꦲ꧀ꦭ";
    } else if (core_sound.CoreSound === "ꦃꦃꦮ") {
      if (vowelPrev) konsonan = "ꦃꦮ";
      else konsonan = "ꦲ꧀ꦮ";
    } else if (core_sound.CoreSound === "ꦃꦲꦾ") {
      if (vowelPrev) konsonan = "ꦃꦪ";
      else konsonan = "ꦲꦾ";
    } else if (findstr(core_sound.CoreSound, 'ꦄ') && matra === "ꦶ") {
      konsonan = "ꦍ"; matra = "";
    } else if (findstr(core_sound.CoreSound, 'ꦆ') && matra === "ꦶ") {
      konsonan = "ꦇ"; matra = "";
    } else if (findstr(core_sound.CoreSound, 'ꦾ') && matra === "꧀") {
      konsonan = core_sound.CoreSound; matra = "";
    } else if (findstr(core_sound.CoreSound, 'ꦿ') && matra === "꧀") {
      konsonan = core_sound.CoreSound; matra = "";
    } else if (findstr(core_sound.CoreSound, 'ꦿ') && matra === "ꦼ") {
      if ((str[0] === "n" && str[1] === "y") || ((str[0] === "t" || str[0] === "d") && str[1] === "h")) {
        konsonan = GetCoreSound(str[0] + str[1], options.murda).CoreSound + "ꦽ"; matra = "";
      } else if (str[0] === "n" && str[1] === "g") {
        if (str[2] === "g") konsonan = "ꦔ꧀ꦒꦽ"; else konsonan = "ꦔꦽ"; matra = "";
      } else {
        konsonan = GetCoreSound(str[0], options.murda).CoreSound + "ꦽ"; matra = "";
      }
    } else if (findstr(core_sound.CoreSound, 'ꦭ') && matra === "ꦼ") {
      if ((str[0] === "n" && str[1] === "y") || ((str[0] === "t" || str[0] === "d") && str[1] === "h")) {
        konsonan = GetCoreSound(str[0] + str[1], options.murda).CoreSound + "꧀ꦭꦼ"; matra = "";
      } else if (str[0] === "n" && str[1] === "g") {
        if (str[2] === "g") konsonan = "ꦔ꧀ꦒ꧀ꦭꦼ"; else konsonan = "ꦔ꧀ꦭꦼ"; matra = "";
      } else if (str[0] === "l") {
        konsonan = "ꦊ"; matra = "";
      } else {
        konsonan = GetCoreSound(str[0], options.murda).CoreSound + "꧀ꦭꦼ"; matra = "";
      }
    } else if (core_sound.CoreSound === 'ꦃ' && matra === "꧀") {
      konsonan = "ꦲ";
    } else if (core_sound.CoreSound === 'ꦃ' && matra !== "꧀") {
      konsonan = "ꦲ";
    } else if (core_sound.CoreSound === 'ꦂ' && matra === "ꦼ") {
      konsonan = "ꦉ"; matra = "";
    } else if (core_sound.CoreSound === 'ꦂ' && matra === "꧀") {
      konsonan = "ꦫ";
    } else if (core_sound.CoreSound === 'ꦂ' && matra !== "꧀") {
      konsonan = "ꦫ";
    } else if (core_sound.CoreSound === 'ꦁ\u200b' && matra === "꧀") {
      konsonan = "ꦁ\u200b"; matra = "";
    } else if (core_sound.CoreSound === 'ꦁ\u200b' && matra !== "꧀") {
      konsonan = "ꦔ";
    } else {
      konsonan = core_sound.CoreSound;
    }
    return "" + konsonan + matra;
  }
}

export function latinToJawa(str: string, opt?: TransliterateOptions): string {
  const options: Required<TransliterateOptions> = {
    mode: opt?.mode || 'ketik',
    murda: opt?.murda || 'tidak',
    diftong: opt?.diftong || 'tidak',
    spasi: opt?.spasi || 'without',
    ...opt
  };

  let i = 0;
  let ret = "";
  let pi = 0;
  let vowelFlag = false;
  let angkaFlag = false;
  let cecakFlag = false;
  let vowelPrev = false;

  const angka: Record<string, string> = {
    "0": '꧐', "1": '꧑', "2": '꧒', "3": '꧓', "4": '꧔', "5": '꧕', "6": '꧖', "7": '꧗', "8": '꧘', "9": '꧙'
  };

  str = str.trim().replace(/\s+/g, ' ');

  while (i < str.length) {
    if (i > 0 && isVowel(str[i]) && isVowel(str[i - 1])) {
      if ((str[i - 1] === 'a' && str[i] === 'a') || (str[i - 1] === 'i' && str[i] === 'i') || (str[i - 1] === 'u' && str[i] === 'u') || (str[i - 1] === 'a' && str[i] === 'i') || (str[i - 1] === 'a' && str[i] === 'u')) {
        if (i === 1 || (i > 1 && !isConsonant(str[i - 2]))) {
          str = str.substring(0, i) + 'h' + str.substring(i, str.length);
        } else {
          if (options.diftong === 'tidak') {
            str = str.substring(0, i) + 'h' + str.substring(i, str.length);
          }
        }
      } else if ((str[i - 1] === 'e' || str[i - 1] === 'è' || str[i - 1] === 'é') && (str[i] === 'a' || str[i] === 'o')) {
        str = str.substring(0, i) + 'y' + str.substring(i, str.length);
      } else if ((str[i - 1] === 'i') && (str[i] === 'a' || str[i] === 'e' || str[i] === 'è' || str[i] === 'é' || str[i] === 'o' || str[i] === 'u')) {
        str = str.substring(0, i) + 'y' + str.substring(i, str.length);
      } else if ((str[i - 1] === 'o') && (str[i] === 'a' || str[i] === 'e' || str[i] === 'è' || str[i] === 'é')) {
        str = str.substring(0, i) + 'w' + str.substring(i, str.length);
      } else if ((str[i - 1] === 'u') && (str[i] === 'a' || str[i] === 'e' || str[i] === 'è' || str[i] === 'é' || str[i] === 'i' || str[i] === 'o')) {
        str = str.substring(0, i) + 'w' + str.substring(i, str.length);
      } else {
        str = str.substring(0, i) + 'h' + str.substring(i, str.length);
      }
    }

    if ((isSpecial(str[i]) || isLW(str[i]) || isCJ(str[i])) && !vowelFlag) {
      // do nothing
    } else if (i > 0 && isSwara(str[i]) && str[i - 1] === 'q') {
      vowelFlag = true;
    } else if ((str[i] === 'h' && vowelFlag) || (!isVowel(str[i]) && i > 0) || (str[i] === ' ') || isPunct(str[i]) || isDigit(str[i]) || ((i - pi) > 5)) {
      if (!isDigit(str[i]) && angkaFlag) {
        ret += "꧇\u200b";
        angkaFlag = false;
      }
      if (pi < i) {
        const chunk = str.substring(pi, i);
        const sound = GetSound(chunk, options, vowelPrev);
        if (cecakFlag && sound === "ꦁ") {
          cecakFlag = false;
          ret += "ꦔ꧀ꦔ";
        } else if (!cecakFlag && sound === "ꦁ") {
          cecakFlag = true;
          ret += "ꦁ\u200b";
        } else {
          cecakFlag = false;
          ret += sound;
        }
      }
      if (str[i] === ' ') {
        let spasi = "";
        if (options.spasi === 'without') {
          if (i > 0 && ['a', 'e', 'i', 'o', 'u', 'r', 'h', 'ě', 'è', 'é', 'ê', 'ě', 'ĕ', 'ə', 'ô', 'â', 'ā', 'ī', 'ū', 'ō'].indexOf(str[i - 1]) >= 0) {
            spasi = '\u200b';
          } else {
            spasi = '';
          }
        } else {
          spasi = '\u200b';
        }
        ret += spasi;
      }
      if (isPunct(str[i])) {
        if (str[i] === '.') {
          ret += "꧉\u200b";
          pi = i + 1;
        } else if (str[i] === ',') {
          ret += "꧈\u200b";
          pi = i + 1;
        } else if (str[i] === ':') {
          ret += "꧇\u200b";
          pi = i + 1;
        } else if (str[i] === '|') {
          ret += "꧋";
          pi = i + 1;
        } else if (str[i] === '-') {
          ret += "\u200b";
          pi = i + 1;
        } else if (str[i] === '?' || str[i] === '!' || str[i] === '"' || str[i] === "'") {
          ret += "\u200b";
          pi = i + 1;
        } else {
          ret += str[i];
          pi = i + 1;
        }
      } else if (isDigit(str[i])) {
        if (!angkaFlag) ret += "꧇";
        ret += angka[str[i]] || '';
        angkaFlag = true;
        pi = i + 1;
      } else {
        pi = i;
      }
      vowelFlag = false;
    } else if (isVowel(str[i]) && str[i] !== 'h') {
      if (!isDigit(str[i]) && angkaFlag) {
        ret += "꧇\u200b";
        angkaFlag = false;
      }
      vowelFlag = true;
    }

    if (pi > 0 && isVowel(str[pi - 1])) {
      vowelPrev = true;
    } else {
      vowelPrev = false;
    }

    i++;
  }

  if (pi < i) {
    ret += GetSound(str.substring(pi, i), options, vowelPrev);
  }

  return ret.trim();
}

export function jawaToLatin(str: string): string {
  const regexp_file = java2latn;
  let trans = str;
  let j = 0;

  const ganti = (s: string, idx: number, character: string) => s.substring(0, idx) + character;
  const ganti2 = (s: string, idx: number, character: string) => s.substring(0, idx - 1) + character;
  const ganti3 = (s: string, idx: number, character: string) => s.substring(0, idx - 2) + character;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (!regexp_file[char]) {
      trans = ganti(trans, j, char);
      j++;
    } else {
      if (char === "ꦴ" || char === "ꦶ" || char === "ꦸ" || char === "ꦺ" || char === "ꦼ") {
        if (i > 2 && str[i - 1] === "ꦲ" && str[i - 2] === "ꦲ") {
          if (char === "ꦴ") trans = ganti3(trans, j, "ā");
          else if (char === "ꦶ") trans = ganti3(trans, j, "ai");
          else if (char === "ꦸ") trans = ganti3(trans, j, "au");
          else if (char === "ꦺ") trans = ganti3(trans, j, "ae");
          else if (char === "ꦼ") trans = ganti3(trans, j, "aě");
        } else if (i > 2 && str[i - 1] === "ꦲ") {
          if (char === "ꦴ") trans = ganti2(trans, j, "ā");
          else if (char === "ꦶ") trans = ganti2(trans, j, "i");
          else if (char === "ꦸ") trans = ganti2(trans, j, "u");
          else if (char === "ꦺ") trans = ganti2(trans, j, "e");
          else if (char === "ꦼ") trans = ganti2(trans, j, "ě");
        } else if (i > 0 && char === "ꦴ" && str[i - 1] === "ꦺ") {
          trans = ganti2(trans, j, "o");
        } else if (i > 0 && char === "ꦴ" && str[i - 1] === "ꦻ") {
          trans = ganti3(trans, j, "au");
        } else if (i > 1 && char === "ꦺ" && str[i - 1] === "ꦲ" && (str[i - 2] === "ꦧ" || str[i - 2] === "ꦮ")) {
          trans = ganti3(trans, j, "e");
        } else if (char === "ꦴ") {
          trans = ganti(trans, j, "aa");
          j++;
        } else if (i > 0 && (char === "ꦶ" || char === "ꦸ" || char === "ꦺ" || char === "ꦼ") && (str[i - 1] === "ꦄ" || str[i - 1] === "ꦌ" || str[i - 1] === "ꦆ" || str[i - 1] === "ꦎ" || str[i - 1] === "ꦈ")) {
          trans = ganti(trans, j, regexp_file[char]);
          j++;
        } else {
          trans = ganti2(trans, j, regexp_file[char]);
        }
      } else if (char === "ꦽ" || char === "ꦾ" || char === "ꦿ" || char === "ꦷ" || char === "ꦹ" || char === "ꦻ" || char === "ꦇ" || char === "ꦍ") {
        trans = ganti2(trans, j, regexp_file[char]);
        j++;
      } else if (char === "꦳") {
        if (i > 0 && str[i - 1] === "ꦗ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Za"); }
          else { trans = ganti3(trans, j, "za"); }
        } else if (i > 0 && str[i - 1] === "ꦥ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Fa"); }
          else { trans = ganti3(trans, j, "fa"); }
        } else if (i > 0 && str[i - 1] === "ꦮ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Va"); }
          else { trans = ganti3(trans, j, "va"); }
        } else if (i > 0 && str[i - 1] === "ꦲ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Ḥa"); }
          else { trans = ganti3(trans, j, "ḥa"); }
        } else if (i > 0 && str[i - 1] === "ꦏ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Kha"); j++; }
          else { trans = ganti3(trans, j, "kha"); j++; }
        } else if (i > 0 && str[i - 1] === "ꦢ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Dza"); j++; }
          else { trans = ganti3(trans, j, "dza"); j++; }
        } else if (i > 0 && str[i - 1] === "ꦱ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Sya"); j++; }
          else { trans = ganti3(trans, j, "sya"); j++; }
        } else if (i > 0 && str[i - 1] === "ꦒ") {
          if (i > 1 && str[i - 2] === "꧊") { trans = ganti3(trans, j, "Gha"); j++; }
          else { trans = ganti3(trans, j, "gha"); j++; }
        } else if (i > 0 && str[i - 1] === "ꦔ") {
          trans = ganti3(trans, j, "'a");
        } else {
          trans = ganti2(trans, j, regexp_file[char]);
        }
      } else if (char === "꧀") {
        trans = ganti2(trans, j, regexp_file[char]);
      } else if (char === "ꦏ" || char === "ꦐ" || char === "ꦒ" || char === "ꦕ" || char === "ꦗ" || char === "ꦟ" || char === "ꦠ" || char === "ꦡ" || char === "ꦢ" || char === "ꦣ" || char === "ꦤ" || char === "ꦥ" || char === "ꦦ" || char === "ꦧ" || char === "ꦨ" || char === "ꦩ" || char === "ꦪ" || char === "ꦫ" || char === "ꦬ" || char === "ꦭ" || char === "ꦮ" || char === "ꦯ" || char === "ꦰ" || char === "ꦱ" || char === "ꦉ" || char === "ꦊ" || char === "ꦁ" || char === "ꦲ" || char === "ꦑ" || char === "ꦓ" || char === "ꦖ" || char === "ꦙ") {
        if (i > 0 && str[i - 1] === "꧊") {
          if (char === "ꦐ") { trans = ganti(trans, j, "Qa"); j += 2; }
          else if (char === "ꦧ" || char === "ꦨ") { trans = ganti(trans, j, "Ba"); j += 2; }
          else if (char === "ꦕ" || char === "ꦖ") { trans = ganti(trans, j, "Ca"); j += 2; }
          else if (char === "ꦢ" || char === "ꦣ") { trans = ganti(trans, j, "Da"); j += 2; }
          else if (char === "ꦒ" || char === "ꦓ") { trans = ganti(trans, j, "Ga"); j += 2; }
          else if (i > 1 && char === "ꦁ" && str[i - 1] === "ꦶ" && str[i - 2] === "ꦲ") { trans = ganti(trans, j, "_ing"); j += 4; }
          else if (char === "ꦲ") {
            if (i > 0 && (str[i - 1] === "ꦼ" || str[i - 1] === "ꦺ" || str[i - 1] === "ꦶ" || str[i - 1] === "ꦴ" || str[i - 1] === "ꦸ" || str[i - 1] === "ꦄ" || str[i - 1] === "ꦌ" || str[i - 1] === "ꦆ" || str[i - 1] === "ꦎ" || str[i - 1] === "ꦈ" || str[i - 1] === "ꦿ" || str[i - 1] === "ꦾ" || str[i - 1] === "ꦽ")) {
              trans = ganti(trans, j, "h" + regexp_file[char]); j += 2;
            } else if (i > 0 && (str[i - 1] === "꧊")) {
              trans = ganti(trans, j, "H" + regexp_file[char]); j += 2;
            } else {
              trans = ganti(trans, j, "@" + regexp_file[char]); j += 2;
            }
          }
          else if (char === "ꦗ" || char === "ꦙ") { trans = ganti(trans, j, "Ja"); j += 2; }
          else if (char === "ꦏ" || char === "ꦑ") { trans = ganti(trans, j, "Ka"); j += 2; }
          else if (char === "ꦭ") { trans = ganti(trans, j, "La"); j += 2; }
          else if (char === "ꦩ") { trans = ganti(trans, j, "Ma"); j += 2; }
          else if (char === "ꦤ" || char === "ꦟ") { trans = ganti(trans, j, "Na"); j += 2; }
          else if (char === "ꦥ" || char === "ꦦ") { trans = ganti(trans, j, "Pa"); j += 2; }
          else if (char === "ꦫ" || char === "ꦬ") { trans = ganti(trans, j, "Ra"); j += 2; }
          else if (char === "ꦱ" || char === "ꦯ") { trans = ganti(trans, j, "Sa"); j += 2; }
          else if (char === "ꦠ" || char === "ꦡ") { trans = ganti(trans, j, "Ta"); j += 2; }
          else if (char === "ꦮ") { trans = ganti(trans, j, "Wa"); j += 2; }
          else if (char === "ꦪ") { trans = ganti(trans, j, "Ya"); j += 2; }
          else { trans = ganti(trans, j, regexp_file[char]); j += 3; }
        } else if (i > 0 && char === "ꦲ" && str[i - 1] === "ꦃ") {
          trans = ganti(trans, j, "a"); j++;
        } else if (i > 0 && char === "ꦫ" && str[i - 1] === "ꦂ") {
          trans = ganti(trans, j, "a"); j++;
        } else if (i > 0 && str[i] === "ꦔ" && str[i - 1] === "ꦁ") {
          trans = ganti(trans, j, "a"); j++;
        } else if (i > 1 && char === "ꦕ" && str[i - 1] === "꧀" && str[i - 2] === "ꦚ") {
          trans = ganti(trans, j - 3, "nca");
        } else if (i > 1 && char === "ꦗ" && str[i - 1] === "꧀" && str[i - 2] === "ꦚ") {
          trans = ganti(trans, j - 3, "nja");
        } else if (char === "ꦲ") {
          trans = ganti(trans, j, "_a"); j += 2;
        } else {
          trans = ganti(trans, j, regexp_file[char]); j += 2;
        }
      } else if (char === "ꦔ" || char === "ꦘ" || char === "ꦚ" || char === "ꦛ" || char === "ꦜ" || char === "ꦝ" || char === "ꦞ" || char === "ꦋ" || char === "ꦑ" || char === "ꦓ" || char === "ꦖ" || char === "ꦙ" || char === "ꦡ" || char === "ꦦ" || char === "ꦨ") {
        if (i > 0 && str[i - 1] === "꧊") {
          if (char === "ꦔ") { trans = ganti(trans, j, "Nga"); j += 3; }
          else if (char === "ꦚ" || char === "ꦘ") { trans = ganti(trans, j, "Nya"); j += 3; }
          else if (char === "ꦛ" || char === "ꦜ") { trans = ganti(trans, j, "Tha"); j += 3; }
          else if (char === "ꦝ" || char === "ꦞ") { trans = ganti(trans, j, "Dha"); j += 3; }
          else { trans = ganti(trans, j, regexp_file[char]); j += 3; }
        } else if (i > 0 && str[i] === "ꦘ") {
          trans = ganti(trans, j, regexp_file[char]); j += 4;
        } else {
          trans = ganti(trans, j, regexp_file[char]); j += 3;
        }
      } else if (char === "꧊") {
        trans = ganti(trans, j, "");
      } else if (char === " ") {
        if (i > 0 && str[i - 1] === "꧀") {
          trans = ganti(trans, j, ", "); j += 2;
        } else {
          trans = ganti(trans, j, " "); j++;
        }
      } else if (char === "꧈") {
        if (i > 0 && str[i - 1] === "꧀") {
          trans = ganti(trans, j, "."); j++;
        } else {
          trans = ganti(trans, j, ","); j++;
        }
      } else {
        trans = ganti(trans, j, regexp_file[char]); j++;
      }
    }
  }

  // Clean up any special characters or formatting leftovers if necessary for general readability
  // For example, replacing initial "@" or "_" in phonetic markers to look more natural
  return trans.replace(/_a/g, 'a').replace(/@/g, '').replace(/_/g, '').replace(/\u200b/g, '');
}
