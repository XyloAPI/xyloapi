import { Router } from 'express';
import { executePipeline } from '../utils/pipeline';
import { File as MegaFile } from 'megajs';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';

const router = Router();

const BLOCKED_EXTENSIONS = [
  '.exe', '.msi', '.bat', '.cmd', '.scr', '.iso', '.vbs', '.js', '.wsf', 
  '.com', '.pif', '.gadget', '.cpl', '.hta', '.msc', 
  '.zip', '.rar', '.7z', '.tar', '.gz'
];

router.all('/downloader/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    try {
      fs.appendFileSync(
        path.join(__dirname, '..', '..', 'incoming_requests.log'),
        JSON.stringify({ timestamp: new Date().toISOString(), slug, payload }) + '\n',
        'utf-8'
      );
    } catch (logErr) {}

    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    if (slug === 'mega') {
      const url = payload.url;
      if (!url) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to process request"
        });
      }

      try {
        const file = MegaFile.fromURL(url);
        let filename = 'mega_download.bin';
        let size = 0;

        try {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Timeout")), 2000);
            file.loadAttributes((err: any) => {
              clearTimeout(timeout);
              if (!err) {
                filename = file.name || 'mega_download.bin';
                size = file.size || 0;
              }
              resolve();
            });
          });
        } catch (e) {
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            if (lastPart && lastPart.includes('.')) {
              filename = lastPart;
            }
          } catch (urlErr) {}
        }

        const urlBase64 = Buffer.from(url).toString('base64url');
        const fileUrl = `${protocol}://${reqHost}/api/downloads/mega/${urlBase64}/${encodeURIComponent(filename)}`;

        return res.json({
          success: true,
          creator: "XyloAPI",
          data: {
            title: filename,
            creator: "MEGA",
            description: `Resolved MEGA file: ${filename} (${size ? (size / (1024 * 1024)).toFixed(2) + ' MB' : 'Size unknown'})`,
            cover: "https://mega.nz/favicon.ico",
            links: [
              {
                label: "DOWNLOAD FILE (Direct Stream)",
                url: fileUrl
              }
            ]
          }
        });
      } catch (err: any) {
        return res.status(500).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to process request"
        });
      }
    }

    const result = await executePipeline(slug, payload, reqHost, protocol);

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

router.get('/downloads/:fileId/:filename', async (req, res) => {
  const { fileId, filename } = req.params;
  const ext = path.extname(filename).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return res.status(403).json({
      success: false,
      creator: "XyloAPI",
      error: "Downloading executable or archive files is disabled for security reasons."
    });
  }
  const filePath = path.join(__dirname, '..', '..', 'downloads', fileId, filename);
  const dirPath = path.join(__dirname, '..', '..', 'downloads', fileId);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      try {
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      } catch (rmErr) {
        // silent
      }
    });
  } else {
    return res.status(404).json({
      success: false,
      creator: "XyloAPI",
      error: "Failed to process request"
    });
  }
});

router.get('/downloads/mega/:urlBase64/:filename', async (req, res) => {
  const { urlBase64, filename } = req.params;
  const ext = path.extname(filename).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return res.status(403).json({
      success: false,
      creator: "XyloAPI",
      error: "Downloading executable or archive files is disabled for security reasons."
    });
  }
  try {
    const url = Buffer.from(urlBase64, 'base64url').toString('utf8');
    const file = MegaFile.fromURL(url);

    let size = 0;
    try {
      await new Promise<void>((resolve) => {
        file.loadAttributes((err: any) => {
          if (!err && file.size) {
            size = file.size;
          }
          resolve();
        });
      });
    } catch (e) {}

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    if (size > 0) {
      res.setHeader('Content-Length', size.toString());
    }

    const stream = file.download({});
    stream.on('error', (err: any) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to process request"
        });
      }
    });

    stream.pipe(res);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        creator: "XyloAPI",
        error: "Failed to process request"
      });
    }
  }
});

export default router;
