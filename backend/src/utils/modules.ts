import fs from 'fs';
import path from 'path';

// Static template metadata for the modules
const staticModulesTemplates = [
  {
    id: "uploaders",
    name: "Media Uploaders Pack",
    description: "Upload image assets and files directly to CDNs like Imgur, Catbox, and Top4Top.",
    status: "active",
    endpointsCount: 0, // Will be computed dynamically
  },
  {
    id: "downloaders",
    name: "Media Downloaders Pack",
    description: "Download video and audio streams directly from platforms like TikTok, Instagram, YouTube, Spotify, SoundCloud, Twitter/X, Threads, Facebook, Bilibili, SnackVideo, CapCut, CocoFun, Douyin, YouTube Community, GitHub, Google Drive, MediaFire, MEGA, NPM, Pinterest, RedNote (Xiaohongshu), Scribd, SFile.co, TeraBox, Dailymotion, Pornhub, PornHD, and XNXX.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "news",
    name: "News Scrapers Pack",
    description: "Fetch latest news from 37 sources: ST, CNA, BBC, CNN, Mothership, Al Jazeera, ABC, WaPo, AP News, Fox News, Reuters, CBS, NYT, MS NOW, WSJ, The Guardian, TIME, Sky News, NPR, Bloomberg, The Times, DW, NHL, News24, Newsweek, Yahoo News, U.S. News, NBC News, NASA, Detroit Free Press, MassLive, WMTV 15 News, Forbes, Euronews, USA Today, The Independent, and The Punch.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "local-news",
    name: "Local News Scrapers Pack",
    description: "Fetch latest local news from Indonesian sources: Detik News, Kompas News, CNN Indonesia, Liputan6 News, Sindonews, Antara News, BMKG News, Tempo, Bisnis.com, Okezone, CNBC Indonesia, TIMES Indonesia, Inilah.com, Bank Indonesia, Hukumonline, Media Indonesia, Berita Jakarta, Tangerang Kota, Kompas TV, VIVA News, iNews, Terkini News, CNA Indonesia, Merdeka News, and The Jakarta Post.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "image-tools",
    name: "Image Tools Pack",
    description: "Process and edit images using tools like background removal, AI upscaling, vintage filters, color inversion, image flipping, retro pixelation, rounded corners, image splitting, adding noise, image blurring, image sharpening, solarize filters, glow effects, posterize effects, blur face effects, and AI image enhancement.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "qr-tools",
    name: "QR Tools Pack",
    description: "Generate, style, and decode high-quality QR codes and barcodes online instantly.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "shortlink-tools",
    name: "Shortlink Tools Pack",
    description: "Generate and manage shortened urls using popular platforms like TinyURL, is.gd, v.gd, ulvis.net, da.gd, and cleanuri.com.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "ai-chat",
    name: "AI Chat Tools Pack",
    description: "Interact with state-of-the-art language models like Llama 3.3, Groq Compound, Qwen 2.5, MiniMax, DeepSeek, Kimi, GLM 5.1, Nemotron Ultra, ChatGPT, IBM Granite 4.0, Mistral AI, QuillBot AI, Perplexity AI, Google Gemini, Pollinations AI, Asynt AI, Muslim AI, Gita AI, PowerBrain AI, Felo AI, MathGPT, Jeeves AI, Sahabat AI, Aya AI, Ansari AI, Olabiba AI, Gemma 4, DeepSeek R1, and FeelBetter AI.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "ai-image",
    name: "AI Image Generator Pack",
    description: "Generate stunning AI images using state-of-the-art models like Flux 1 Schnell, Flux 2, Magic Studio, Z-Image Turbo, Qwen Image, ERNIE Image Turbo, and Ideogram 4.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "bmkg",
    name: "BMKG Indonesia Pack",
    description: "Akses data gempa terkini, gempa terbaru, gempa dirasakan, dan berita resmi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia).",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "informations",
    name: "Informations Pack",
    description: "Akses informasi cuaca, cari kode pos, jadwal TV, dan jadwal pertandingan sepak bola dari OneFootball.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "ai-image-edit",
    name: "AI Image Edit Pack",
    description: "Transform and edit images using various styles like Javanese attire, old age progress, chibi, lego, anime, and more.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "maker",
    name: "Image Maker Pack",
    description: "Generate custom logos, phone mockups, fake chat screenshots, and certification cards.",
    status: "active",
    endpointsCount: 0,
  },
  {
    id: "tools",
    name: "Tools Pack",
    description: "Utility tools for daily tasks like website screenshot capturing, web scraping, and data utilities.",
    status: "active",
    endpointsCount: 0,
  },
];

// Map python scraper folder categories to module IDs
const categoryToModuleMap: Record<string, string> = {
  uploader: "uploaders",
  downloader: "downloaders",
  news: "news",
  local_news: "local-news",
  image_tools: "image-tools",
  qr_tools: "qr-tools",
  shortlink_tools: "shortlink-tools",
  ai_chat: "ai-chat",
  ai_image: "ai-image",
  bmkg: "bmkg",
  informations: "informations",
  ai_image_edit: "ai-image-edit",
  maker: "maker",
  tools: "tools",
};

let cachedModules = staticModulesTemplates.map(m => ({ ...m }));
let lastMtime = 0;

export function getApiModules() {
  const registryPath = path.join(__dirname, "..", "..", "scrapers", "registry.py");
  
  if (!fs.existsSync(registryPath)) {
    return cachedModules;
  }

  try {
    const stats = fs.statSync(registryPath);
    if (stats.mtimeMs !== lastMtime) {
      const fileContent = fs.readFileSync(registryPath, 'utf8');
      const lines = fileContent.split('\n');
      
      const countMap: Record<string, number> = {};
      Object.values(categoryToModuleMap).forEach(moduleId => {
        countMap[moduleId] = 0;
      });

      const regex = /^\s*["']([^"']+)["']\s*:\s*\[\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\]/;

      for (const line of lines) {
        const match = line.match(regex);
        if (match) {
          const fullModulePath = match[2]; // e.g., "uploader.imgur_uploader"
          const category = fullModulePath.split('.')[0]; // e.g., "uploader"
          const moduleId = categoryToModuleMap[category];
          if (moduleId && countMap[moduleId] !== undefined) {
            countMap[moduleId]++;
          }
        }
      }

      const newModules = staticModulesTemplates.map(m => ({ ...m }));
      newModules.forEach(m => {
        if (countMap[m.id] !== undefined) {
          m.endpointsCount = countMap[m.id];
        }
      });

      cachedModules = newModules;
      lastMtime = stats.mtimeMs;
    }
  } catch (error) {
    console.error("Failed to parse registry.py dynamically:", error);
  }

  return cachedModules;
}

// Keep backward compatibility
export const apiModules = getApiModules();
