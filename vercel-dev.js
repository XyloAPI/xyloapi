const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Prepend Python 3.12 and frontend node_modules bin path to PATH to ensure vercel-runtime and vite execute correctly on Windows
process.env.PATH = "E:\\project\\xyloapi\\frontend\\node_modules\\.bin;C:\\Users\\lenov\\AppData\\Local\\Programs\\Python\\Python312;" + process.env.PATH;

console.log("[Fixer] Starting Vercel Dev and watching for vc_init_dev.py...");

const child = spawn('npx', ['vercel', 'dev', '--debug', '--yes', '--scope', 'team_mRCxogYdgqxspxTQxojVh9FP'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

// Target directory where Vercel CLI writes the dev config file
const targetDir = path.join(__dirname, 'backend', 'scrapers', '.vercel', 'python', 'services', 'scrapers');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(targetDir);

const targetFile = path.join(targetDir, 'vc_init_dev.py');

// Periodically check and convert Windows backslashes to forward slashes in generated paths
const interval = setInterval(() => {
  if (fs.existsSync(targetFile)) {
    try {
      let content = fs.readFileSync(targetFile, 'utf8');
      if (content.includes('\\')) {
        console.log(`[Fixer] Found unescaped path backslashes in ${targetFile}. Converting to forward slashes...`);
        // Replace backslashes in strings with forward slashes
        content = content.replace(/"([^"]*\\+[^"]*)"/g, (match, pathStr) => {
          return '"' + pathStr.replace(/\\+/g, '/') + '"';
        });
        fs.writeFileSync(targetFile, content, 'utf8');
        console.log("[Fixer] Successfully converted backslashes!");
      }
    } catch (err) {
      // Ignore read/write locking issues during active edits; it will retry on the next tick
    }
  }
}, 20);

child.on('exit', (code) => {
  clearInterval(interval);
  process.exit(code || 0);
});
