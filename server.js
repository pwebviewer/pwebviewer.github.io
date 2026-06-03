const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

// .pweb MIME type
express.static.mime.define({ 'application/vnd.portableweb+zip': ['pweb'] });

// Serve JSZip from node_modules at a stable URL the PWA app can reference
app.get('/app/jszip.min.js', (_req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/jszip/dist/jszip.min.js'));
});

// Static assets
app.use(express.static(PUBLIC));

// SPA fallback: any /app/* path returns the app shell
app.get('/app/*', (_req, res) => {
  res.sendFile(path.join(PUBLIC, 'app', 'index.html'));
});

// Root fallback: marketing homepage
app.get('*', (_req, res) => {
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PortableWeb web server → http://localhost:${PORT}`);
  console.log(`  Marketing homepage → http://localhost:${PORT}/`);
  console.log(`  PWA viewer        → http://localhost:${PORT}/app/`);
});
