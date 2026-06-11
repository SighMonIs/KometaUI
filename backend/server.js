const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const CONFIG_DIR = process.env.KOMETA_CONFIG_DIR || '/config';

// Ensure config dir exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// ─── File Management ──────────────────────────────────────────────────────────

app.get('/api/files', (req, res) => {
  try {
    const files = [];
    const walk = (dir, base = '') => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const rel = path.join(base, item.name);
        if (item.isDirectory()) {
          walk(path.join(dir, item.name), rel);
        } else if (item.name.endsWith('.yml') || item.name.endsWith('.yaml')) {
          const full = path.join(dir, item.name);
          const stat = fs.statSync(full);
          files.push({ path: rel, size: stat.size, modified: stat.mtime });
        }
      }
    };
    walk(CONFIG_DIR);
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/files/read', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'No path provided' });
  const full = path.join(CONFIG_DIR, filePath);
  if (!full.startsWith(CONFIG_DIR)) return res.status(403).json({ error: 'Forbidden' });
  try {
    const content = fs.readFileSync(full, 'utf8');
    res.json({ content });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post('/api/files/write', (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || content === undefined) return res.status(400).json({ error: 'Missing path or content' });
  const full = path.join(CONFIG_DIR, filePath);
  if (!full.startsWith(CONFIG_DIR)) return res.status(403).json({ error: 'Forbidden' });
  try {
    // Validate YAML before saving
    yaml.load(content);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/files', (req, res) => {
  const filePath = req.query.path;
  const full = path.join(CONFIG_DIR, filePath);
  if (!full.startsWith(CONFIG_DIR)) return res.status(403).json({ error: 'Forbidden' });
  try {
    fs.unlinkSync(full);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Config Read/Write (parsed) ───────────────────────────────────────────────

app.get('/api/config', (req, res) => {
  const configPath = path.join(CONFIG_DIR, 'config.yml');
  try {
    if (!fs.existsSync(configPath)) {
      return res.json({ exists: false, config: null, raw: '' });
    }
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(raw);
    res.json({ exists: true, config, raw });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/config', (req, res) => {
  const { config } = req.body;
  const configPath = path.join(CONFIG_DIR, 'config.yml');
  try {
    const yamlStr = yaml.dump(config, { lineWidth: 120, quotingType: '"', forceQuotes: false });
    fs.writeFileSync(configPath, yamlStr, 'utf8');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── YAML Validate ────────────────────────────────────────────────────────────

app.post('/api/validate', (req, res) => {
  const { content } = req.body;
  try {
    yaml.load(content);
    res.json({ valid: true });
  } catch (e) {
    res.json({ valid: false, error: e.message, mark: e.mark });
  }
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ ok: true, configDir: CONFIG_DIR });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Kometa UI backend running on :${PORT}`));
