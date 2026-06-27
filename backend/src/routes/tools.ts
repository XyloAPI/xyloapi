import { Router } from 'express';
import { executePipeline } from '../utils/pipeline';

const router = Router();

router.all('/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    let result;
    if (slug === 'deepl') {
      const { translateDeepL } = require('../utils/deeplTranslator');
      const text = payload.text || payload.q;
      if (!text) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to process request"
        });
      }
      result = await translateDeepL(text, payload.from || payload.sl, payload.to || payload.tl);
    } else if (slug === 'aksara-jawa' || slug === 'aksarajawa') {
      const { latinToJawa, jawaToLatin } = require('../utils/aksaraJawa');
      const text = payload.text || payload.q;
      if (!text) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to process request"
        });
      }
      const direction = payload.direction || 'latin2jawa';
      let converted = '';
      if (direction === 'jawa2latin') {
        converted = jawaToLatin(text);
      } else {
        converted = latinToJawa(text, {
          mode: payload.mode,
          murda: payload.murda,
          diftong: payload.diftong,
          spasi: payload.spasi
        });
      }
      result = {
        success: true,
        data: {
          result: converted,
          direction,
          text
        }
      };
    } else if (slug === 'hitung-jarak' || slug === 'hitungjarak') {
      const { hitungJarak } = require('../utils/hitungJarak');
      const from = payload.from || payload.dari || payload.kota1;
      const to = payload.to || payload.ke || payload.kota2;
      if (!from || !to) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameters 'from' and 'to' are required."
        });
      }
      try {
        const data = await hitungJarak(from, to);
        result = {
          success: true,
          data
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to calculate distance"
        });
      }
    } else if (slug === 'base64-to-image' || slug === 'base64toimage') {
      const base64 = payload.base64 || payload.str || payload.q;
      if (!base64) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'base64' is required."
        });
      }

      let dataUrl = base64.trim();
      if (!dataUrl.startsWith('data:image/')) {
        let mime = 'image/png';
        const firstChar = dataUrl.charAt(0);
        if (firstChar === '/') {
          mime = 'image/jpeg';
        } else if (firstChar === 'R') {
          mime = 'image/gif';
        } else if (firstChar === 'i') {
          mime = 'image/png';
        } else if (firstChar === 'U') {
          mime = 'image/webp';
        }
        dataUrl = `data:${mime};base64,${dataUrl}`;
      }

      try {
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(base64Data, 'base64');
        let width = 0;
        let height = 0;
        if (buf.length > 24 && dataUrl.includes('image/png')) {
          width = buf.readInt32BE(16);
          height = buf.readInt32BE(20);
        } else if (buf.length > 9 && (dataUrl.includes('image/jpeg') || dataUrl.includes('image/jpg'))) {
          let i = 4;
          if (buf.readUInt16BE(0) === 0xffd8) {
            while (i < buf.length) {
              const marker = buf.readUInt16BE(i);
              if (marker === 0xffc0 || marker === 0xffc1 || marker === 0xffc2) {
                height = buf.readUInt16BE(i + 5);
                width = buf.readUInt16BE(i + 7);
                break;
              }
              i += 2;
              if (i + 2 <= buf.length) {
                i += buf.readUInt16BE(i);
              }
            }
          }
        }

        let uploadedUrl = dataUrl;
        try {
          const mimeType = dataUrl.split(';')[0].split(':')[1] || 'image/png';
          const ext = mimeType.split('/')[1] || 'png';
          const filename = `image.${ext}`;
          const blob = new Blob([buf], { type: mimeType });
          const formData = new FormData();
          formData.append('files[]', blob, filename);

          const uploadRes = await fetch('https://uguu.se/upload.php', {
            method: 'POST',
            body: formData
          });

          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json() as any;
            if (uploadJson && uploadJson.success && uploadJson.files && uploadJson.files.length > 0) {
              uploadedUrl = uploadJson.files[0].url;
            }
          }
        } catch (uploadErr) {
          console.error("Uguu upload failed, falling back to data URL:", uploadErr);
        }

        result = {
          success: true,
          data: {
            image: uploadedUrl,
            width: width || undefined,
            height: height || undefined,
            aspect_ratio: width && height ? `${width}:${height}` : undefined
          }
        };
      } catch (e) {
        result = {
          success: true,
          data: {
            image: dataUrl
          }
        };
      }
    } else {
      result = await executePipeline(slug, payload, reqHost, protocol);
    }

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        error: "Failed to process request"
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      creator: "XyloAPI",
      error: "Failed to process request"
    });
  }
});

export default router;
