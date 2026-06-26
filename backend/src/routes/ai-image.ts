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

    const result = await executePipeline(slug, payload, reqHost, protocol);

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        ...result
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to execute AI Image pipeline",
      details: error.message || String(error)
    });
  }
});

export default router;
