'use strict';
// Usage: npm run build:single
// Builds dist/ — the whole site inside ONE index.html (CSS, JS, images and video inlined) plus api/contact.js.
// Use it when you can only upload a couple of files (for example from a phone).
const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..'), out = path.join(root, 'dist');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.pdf': 'application/pdf' };
const read = f => fs.readFileSync(path.join(root, f));
const uri = f => 'data:' + (MIME[path.extname(f).toLowerCase()] || 'application/octet-stream') + ';base64,' + read(f).toString('base64');
let h = read('index.html').toString('utf8');
h = h.replace('<link rel="stylesheet" href="css/styles.css">', () => '<style>' + read('css/styles.css').toString('utf8') + '</style>');
h = h.replace(/<script src="(js\/[^"]+)"><\/script>/g, (m, f) => '<script>' + read(f).toString('utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
h = h.replace(/(src|href|poster)="(assets\/[^"]+)"/g, (m, a, f) => fs.existsSync(path.join(root, f)) ? a + '="' + uri(f) + '"' : m);
h = h.replace(/<link rel="manifest"[^>]*>/, '');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'api'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), h);
['api/contact.js', 'vercel.json', 'package.json', 'robots.txt', 'sitemap.xml', '404.html', '.env.example'].forEach(f => { if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(out, f)); });
console.log('dist/index.html  ' + (fs.statSync(path.join(out, 'index.html')).size / 1e6).toFixed(2) + ' MB  (+ dist/api/contact.js)\nDeploy the dist/ folder.');
