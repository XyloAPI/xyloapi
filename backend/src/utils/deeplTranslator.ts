import puppeteer from 'puppeteer';

interface TranslationResult {
  success: boolean;
  retrieved_at?: string;
  data?: {
    translated: string;
    source: string;
    from: string;
    to: string;
  };
  error?: string;
}

let globalBrowser: any = null;

// Helper to get or launch a singleton browser instance (saves huge CPU & RAM on VPS)
async function getBrowserInstance() {
  if (globalBrowser) {
    try {
      // Check if browser is still responsive
      const pages = await globalBrowser.pages();
      if (pages) return globalBrowser;
    } catch {
      globalBrowser = null;
    }
  }

  globalBrowser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage', // Prevents /dev/shm memory issues in low-RAM VPS
      '--no-zygote',
      '--disable-gpu'           // Bypasses GPU acceleration to lower CPU/RAM usage
    ]
  });
  return globalBrowser;
}

export async function translateDeepL(
  text: string,
  fromLang = 'auto',
  toLang = 'id'
): Promise<TranslationResult> {
  const from = (fromLang || 'auto').toLowerCase();
  const to = (toLang || 'id').toLowerCase();

  const deeplUrl = `https://www.deepl.com/translator?share=generic#${from}/${to}/`;

  let browser: any = null;
  let page: any = null;

  try {
    browser = await getBrowserInstance();
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Webdriver fingerprint bypass
    await page.evaluateOnNewDocument(() => {
      const nav = (globalThis as any).navigator;
      if (nav) {
        Object.defineProperty(nav, 'webdriver', {
          get: () => undefined
        });
      }
    });

    // Request interception to block unneeded heavy assets
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      const type = req.resourceType();
      if (type === 'image' || type === 'font' || type === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(deeplUrl, { waitUntil: 'domcontentloaded' });

    // Wait for the source input to load
    const sourceSelector = '[data-testid="translator-source-input"]';
    await page.waitForSelector(sourceSelector, { timeout: 12000 });

    // Inject input text programmatically
    await page.evaluate((val: string) => {
      const doc = (globalThis as any).document;
      const el = doc.querySelector('[data-testid="translator-source-input"]');
      if (!el) return;
      const editable = el.querySelector('[contenteditable]');
      if (editable) {
        editable.innerHTML = '';
        const p = doc.createElement('p');
        p.innerText = val;
        editable.appendChild(p);
        editable.dispatchEvent(new (globalThis as any).Event('input', { bubbles: true }));
        editable.dispatchEvent(new (globalThis as any).Event('change', { bubbles: true }));
        editable.focus();
      } else {
        const textarea = (el.querySelector('textarea') || el) as any;
        textarea.value = val;
        textarea.dispatchEvent(new (globalThis as any).Event('input', { bubbles: true }));
        textarea.dispatchEvent(new (globalThis as any).Event('change', { bubbles: true }));
        textarea.focus();
      }
    }, text);

    // Wait for target to have translation
    const targetSelector = '[data-testid="translator-target-input"]';
    let translation = '';
    let attempts = 0;

    while (translation === '' && attempts < 30) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;

      const val = await page.evaluate((sel: string) => {
        const doc = (globalThis as any).document;
        const el = doc.querySelector(sel);
        if (!el) return '';
        const editable = el.querySelector('[contenteditable]');
        if (editable) {
          return (editable as any).innerText.trim();
        }
        return el.value || el.textContent || '';
      }, targetSelector);

      let textVal = '';
      if (typeof val === 'string') {
        textVal = val;
      }

      translation = textVal.trim();

      // Clean up header labels/scripts
      if (translation.includes('Translation results')) {
        translation = translation.replace('Translation results', '').trim();
      }
      if (translation.includes('(function()')) {
        translation = '';
      }
    }

    if (!translation) {
      throw new Error('Translation resulted in empty text');
    }

    // Detect actual language if 'auto' was requested
    let detectedFrom = from;
    if (from === 'auto') {
      try {
        const langCode = await page.evaluate(() => {
          const doc = (globalThis as any).document;
          const btn = doc.querySelector('[data-testid="translator-source-lang-btn"]');
          if (btn) {
            const langAttr = btn.getAttribute('data-value');
            if (langAttr) return langAttr.toLowerCase();
          }
          return null;
        }) as string | null;
        if (langCode) {
          detectedFrom = langCode;
        }
      } catch {
        // ignore language detection error and fallback to auto
      }
    }

    return {
      success: true,
      retrieved_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      data: {
        translated: translation,
        source: text.trim(),
        from: detectedFrom,
        to: to
      }
    };

  } catch (error: any) {
    console.error('DeepL Puppeteer translation error:', error.message);
    return {
      success: false,
      error: 'Failed to process request'
    };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (err: any) {
        console.error('Error closing page:', err.message);
      }
    }
  }
}
