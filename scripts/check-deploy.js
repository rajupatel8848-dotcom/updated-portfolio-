'use strict';
// Usage: npm run check   — run it in the folder you are about to deploy. Tells you if anything the site needs is missing.
const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
const exists = f => fs.existsSync(path.join(root, f));
let bad = 0;
const must = ['index.html', 'css/styles.css', 'js/main.js', 'js/perf.js', 'js/loader.js', 'js/sound.js', 'js/footer-balls.js', 'assets/images/portrait.jpg', 'assets/video/live.mp4', 'api/contact.js', 'vercel.json'];
must.forEach(f => { if (!exists(f)) { bad++; console.log('MISSING  ' + f); } });
const refs = new Set();
if (exists('index.html')) {
  const h = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const m of h.matchAll(/(?:src|href|poster)="([^"#?]+)"/g)) { const u = m[1]; if (!/^(https?:|data:|mailto:|tel:|javascript:|\/\/)/.test(u)) refs.add(u); }
}
['css/styles.css'].concat(exists('js') ? fs.readdirSync(path.join(root, 'js')).map(f => 'js/' + f) : []).forEach(f => {
  if (!exists(f)) return; const t = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of t.matchAll(/url\(["']?([^)"'#?]+)["']?\)|["'](assets\/[^"']+)["']/g)) { const u = m[1] || m[2]; if (u && !/^(data:|http)/.test(u)) refs.add(u); }
});
refs.forEach(u => { if (!exists(u)) { bad++; console.log('MISSING  ' + u + '   (referenced by the page)'); } });
if (!bad) console.log('All good: ' + refs.size + ' files referenced, none missing. Deploy THIS folder (the one that contains index.html, css/, js/, assets/ and api/).');
else { console.log('\n' + bad + ' problem(s). Deploy the whole folder, not just index.html — upload the css/, js/, assets/ and api/ folders too.'); process.exit(1); }
