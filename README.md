# BlackBoxFX v3.0 — Premium Landing

Institutional-grade SaaS landing page for the BlackBoxFX v3.0 TradingView indicator.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion + GSAP
- Three.js / React Three Fiber
- Nginx (production Docker image)

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Docker

### Production (nginx on port 8080)

```bash
docker compose build web
docker compose up web -d
# → http://localhost:8080
```

### Development with HMR

```bash
docker compose --profile dev up web-dev
# → http://localhost:5173
```

### Stop

```bash
docker compose down
```

## Project structure

```
src/
  components/   # UI sections
  lib/          # constants & content
public/
  uploads/      # static media (chart screenshots)
Dockerfile      # multi-stage production image
docker-compose.yml
nginx.conf      # SPA + caching + security headers
```

## License

Proprietary — BlackBoxFX.
