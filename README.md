# Kometa Config Manager

A Docker-based web UI for managing all Kometa configuration files.

> **⚠️ This project is 100% vibe coded using [Claude Code](https://claude.ai/code). Use at your own risk.**

## Features

- **Connections tab** — Configure Plex, TMDb (required) and all optional connectors:
  Tautulli, Radarr, Sonarr, Trakt, MyAnimeList, OMDb, MDBList, AniDB, GitHub, Notifiarr, Gotify, ntfy
- **Libraries tab** — Add/remove libraries, configure collection files, overlay files, metadata files, and per-library settings
- **Settings tab** — Full control over all global Kometa settings (40+ options) with drag-and-drop run order
- **Files tab** — Browse, create, edit, and delete any `.yml` file in your config directory with live YAML validation
- **Preview** — View the generated `config.yml` as YAML and copy to clipboard

## Quick Start

Create a `docker-compose.yml` anywhere on your machine:

```yaml
services:
  kometaui:
    image: ghcr.io/sighmonis/kometaui:latest
    ports:
      - "8080:3001"
    volumes:
      - ./kometaui:/config
    restart: unless-stopped
```

Then run:

```bash
docker compose up -d
```

Open **http://localhost:8080** in your browser. A `kometaui/` folder will be created automatically next to your `docker-compose.yml` to store your config files.

## Connecting to an existing Kometa config

Change the volume mount to point at your existing config directory:

```yaml
volumes:
  - /path/to/your/kometa/config:/config
```

## Structure

```
backend/
├── public/index.html   # Single-page UI
├── server.js           # Express API server
├── package.json
└── Dockerfile
docker-compose.yml
```

## Ports

| Service | Port |
|---------|------|
| Web UI  | 8080 |
