import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();

import { execSync } from 'child_process';

import { requestLogger } from './middleware/logger';
import coreRouter from './routes/core';
import uploaderRouter from './routes/uploader';
import downloaderRouter from './routes/downloader';
import newsRouter from './routes/news';
import imageToolRouter from './routes/image-tool';
import qrToolRouter from './routes/qr-tool';
import shortlinkRouter from './routes/shortlink';
import aiChatRouter from './routes/ai-chat';
import aiImageRouter from './routes/ai-image';
import bmkgRouter from './routes/bmkg';
import infoRouter from './routes/info';
import makerRouter from './routes/maker';
import aiImageEditRouter from './routes/ai-image-edit';
import toolsRouter from './routes/tools';
import primbonRouter from './routes/primbon';
import searchRouter from './routes/search';

function killPortOwner(port: number) {
  if (process.platform === 'win32') {
    let output = '';
    try {
      output = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    } catch (e: any) {
      return;
    }

    const lines = output.trim().split('\n');
    const killedPids = new Set<string>();
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const localAddr = parts[1];
        const pid = parts[4];
        if (localAddr.endsWith(':' + port) && pid && pid !== '0' && parseInt(pid) !== process.pid) {
          if (!killedPids.has(pid)) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              killedPids.add(pid);
            } catch (err: any) {
              // silent
            }
            const start = Date.now();
            while (Date.now() - start < 500) {}
          }
        }
      }
    }
  } else {
    let pid = '';
    try {
      pid = execSync(`lsof -t -i:${port}`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    } catch (e: any) {
      return;
    }
    if (pid && parseInt(pid) !== process.pid) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      } catch (err: any) {
        // silent
      }
      const start = Date.now();
      while (Date.now() - start < 500) {}
    }
  }
}


const app = express();
app.set('trust proxy', true); // trust X-Forwarded-For from Cloudflare/nginx
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'x-api-key']
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, x-api-key');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use(requestLogger);

app.use('/api', coreRouter);
app.use('/api/uploader', uploaderRouter);
app.use('/api', downloaderRouter);
app.use('/api/news', newsRouter);
app.use('/api/image-tool', imageToolRouter);
app.use('/api/qr-tool', qrToolRouter);
app.use('/api/shortlink', shortlinkRouter);
app.use('/api/ai-chat', aiChatRouter);
app.use('/api/ai-image', aiImageRouter);
app.use('/api/bmkg', bmkgRouter);
app.use('/api/info', infoRouter);
app.use('/api/maker', makerRouter);
app.use('/api/ai-image-edit', aiImageEditRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/primbon', primbonRouter);
app.use('/api', searchRouter);

killPortOwner(Number(PORT));
app.listen(PORT, () => {
});
