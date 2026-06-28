import { Router } from 'express';
import { executePipeline } from '../utils/pipeline';
import path from 'path';
import fs from 'fs';

const router = Router();

router.all('/search/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    try {
      fs.appendFileSync(
        path.join(__dirname, '..', '..', 'incoming_requests.log'),
        JSON.stringify({ timestamp: new Date().toISOString(), category: 'search', slug, payload }) + '\n',
        'utf-8'
      );
    } catch (logErr) {}

    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    let scraperSlug = slug;
    if (slug === 'pinterest' || slug === 'pin') {
      scraperSlug = `${slug}-search`;
    } else if (slug === 'youtube' || slug === 'yt') {
      scraperSlug = `${slug}-search`;
    } else if (slug === 'apple-music' || slug === 'applemusic') {
      scraperSlug = 'apple-music-search';
    } else if (slug === 'bilibili') {
      scraperSlug = 'bilibili-search';
    } else if (slug === 'wikipedia' || slug === 'wiki') {
      scraperSlug = 'wikipedia-search';
    } else if (slug === 'wikimedia') {
      scraperSlug = 'wikimedia-search';
    } else if (slug === 'tiktok') {
      scraperSlug = 'tiktok-search';
    } else if (slug === 'deezer') {
      scraperSlug = 'deezer-search';
    } else if (slug === 'github') {
      scraperSlug = 'github-search';
    } else if (slug === 'chord') {
      scraperSlug = 'chord-search';
    }

    // Run the scraper runner pipeline
    const result = await executePipeline(scraperSlug, payload, reqHost, protocol);

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        error: result.error || "Failed to process request"
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
