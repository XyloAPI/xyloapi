const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const html = await fetch('https://www.jadwaltv.net/');
  
  // Extract channel links from nav/sidebar
  const linkRegex = /<a\s+href="(\/[^"]+tv[^"]*|stasiun[^"]*)"[^>]*>([^<]+)<\/a>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const name = match[2].trim();
    if (name.length > 2 && name.length < 40 && !name.includes('=') && !name.includes('#')) {
      links.push({ url: match[1], name });
    }
  }
  
  console.log('Total links found:', links.length);
  links.slice(0, 30).forEach((l, i) => console.log(i+1 + '.', l.name, '->', l.url));
  
  // Get a channel page
  if (links.length > 0) {
    const target = links.find(l => l.url.includes('trans')) || links[0];
    console.log('\n--- Channel:', target.name, '---');
    const chHtml = await fetch('https://www.jadwaltv.net' + target.url);
    
    // Extract schedule table
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows = [];
    let rowMatch;
    while ((rowMatch = rowRegex.exec(chHtml)) !== null) {
      const tds = rowMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (tds && tds.length >= 2) {
        const time = tds[0].replace(/<[^>]+>/g, '').trim();
        const program = tds[1].replace(/<[^>]+>/g, '').trim();
        if (time && program) rows.push({ time, program });
      }
    }
    console.log('Schedule rows:', rows.length);
    rows.slice(0, 15).forEach(r => console.log('  ' + r.time + ' - ' + r.program));
  }
})();
