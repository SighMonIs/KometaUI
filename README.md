# Kometa Config Manager

A Docker-based web UI for managing all Kometa configuration files.

## Features

- **Connections tab** — Configure Plex, TMDb (required) and all optional connectors:
  Tautulli, Radarr, Sonarr, Trakt, MyAnimeList, OMDb, MDBList, AniDB, GitHub, Notifiarr, Gotify, ntfy
- **Libraries tab** — Add/remove libraries, configure collection files, overlay files, metadata files, and per-library settings
- **Settings tab** — Full control over all global Kometa settings (40+ options) with drag-and-drop run order
- **Files tab** — Browse, create, edit, and delete any `.yml` file in your config directory with live YAML validation
- **Preview** — View the generated `config.yml` as YAML and copy to clipboard

## Quick Start

```bash
# Clone or download this folder
cd kometa-ui

# Optional: if you have an existing Kometa config folder
# edit docker-compose.yml and change ./kometa-config to your path

docker compose up -d --build
```

Then open **http://localhost:8080** in your browser.

## Connecting to an existing Kometa config

Edit `docker-compose.yml` and change the volume mount:

```yaml
volumes:
  - /path/to/your/kometa/config:/kometa/config
```

## Running Kometa alongside the UI

Uncomment the `kometa:` service in `docker-compose.yml` and both containers will share the same config directory.

## Structure

```
kometa-ui/
├── frontend/
│   ├── index.html      # Single-page React-free UI
│   ├── nginx.conf      # Nginx config with API proxy
│   └── Dockerfile
├── backend/
│   ├── server.js       # Express API server
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── kometa-config/      # Shared config directory (auto-created)
```

## Ports

| Service  | Port |
|----------|------|
| Web UI   | 8080 |
| Backend  | 3001 (internal only) |
