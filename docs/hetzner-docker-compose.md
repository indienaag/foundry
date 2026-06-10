# Deploy Personal Website on Hetzner with Docker Compose

This guide deploys the static personal website from GHCR on a Hetzner Cloud server using Docker Compose and Caddy as a reverse proxy.

## Image

```
ghcr.io/indienaag/foundry:latest
ghcr.io/indienaag/foundry:main-<short-sha>
ghcr.io/indienaag/foundry:production-<short-sha>
```

The container listens on port **8080** (nginx unprivileged).

## Prerequisites

- Hetzner Cloud server (Ubuntu 24.04 recommended)
- Docker and Docker Compose installed
- Domain DNS pointed at the server (e.g. `nagaraju.co`)
- GitHub Personal Access Token with `read:packages` scope (for private packages)

## GHCR pull instructions

1. Create a GitHub PAT with `read:packages`.
2. Log in on the server:

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

3. Pull the image:

```bash
docker pull ghcr.io/indienaag/foundry:latest
```

## Directory layout on server

```text
/opt/personal-site/
├── docker-compose.yml
├── Caddyfile
└── .env
```

## Environment file

Create `/opt/personal-site/.env`:

```env
# Image tag to deploy
IMAGE_TAG=latest

# Public domain
DOMAIN=nagaraju.co

# GHCR image (defaults match this repository)
IMAGE=ghcr.io/indienaag/foundry
```

## docker-compose.yml

```yaml
services:
  site:
    image: ${IMAGE}:${IMAGE_TAG}
    container_name: personal-site
    restart: unless-stopped
    expose:
      - "8080"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  caddy:
    image: caddy:2-alpine
    container_name: personal-site-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      site:
        condition: service_healthy
    environment:
      - DOMAIN=${DOMAIN}

volumes:
  caddy_data:
  caddy_config:
```

## Caddyfile

```caddyfile
{$DOMAIN} {
  encode gzip zstd
  reverse_proxy site:8080
}
```

For apex + www:

```caddyfile
{$DOMAIN}, www.{$DOMAIN} {
  encode gzip zstd
  reverse_proxy site:8080
}
```

## Deploy command

```bash
cd /opt/personal-site
docker compose --env-file .env pull
docker compose --env-file .env up -d
```

Verify:

```bash
docker compose ps
curl -I https://nagaraju.co
```

## Update command

To deploy a new image after CI pushes to GHCR:

```bash
cd /opt/personal-site
docker compose --env-file .env pull
docker compose --env-file .env up -d
```

To pin a specific build:

```bash
# In .env
IMAGE_TAG=production-abc1234
```

Then pull and recreate:

```bash
docker compose --env-file .env pull
docker compose --env-file .env up -d
```

## Local validation

Build and run locally before deploying:

```bash
docker build -t personal-site:test .
docker run --rm -p 3000:8080 personal-site:test
```

Open [http://localhost:3000](http://localhost:3000).

## Required GitHub settings

1. **Workflow permissions** (repo → Settings → Actions → General):
   - Allow `GITHUB_TOKEN` to read contents and write packages.

2. **Package visibility** (after first push):
   - Go to the repo → Packages → `foundry`
   - Set visibility (public or private)
   - If private, use a PAT with `read:packages` on the Hetzner server.

3. **Branch trigger**:
   - Workflow runs on push to `main`.
   - Merge changes to `main` to publish images.

## Notes

- The site is static HTML/CSS/JS served by nginx. No runtime env vars are required inside the app container.
- Caddy handles TLS automatically via Let's Encrypt.
- Do not commit `.env` or GHCR tokens to the repository.
