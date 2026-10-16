# Vercel Deployment & Custom Domain Guide: nadaverse.abarjun.online

This guide outlines the complete setup for deploying the **NadaVerse** web application to Vercel and connecting your custom domain `nadaverse.abarjun.online`.

---

## 1. Import Repository into Vercel

1. Log in to [vercel.com](https://vercel.com) and navigate to your dashboard.
2. Click **"Add New..."** > **"Project"**.
3. Select and import the repository: `AnandBinuArjun/NadaVerse`.

---

## 2. Configure Monorepo Project Settings

Because the Next.js application is located in the `web/` folder of the repository:

1. Under **Root Directory**, click **Edit** and set it to:
   ```text
   web
   ```
2. Leave **Framework Preset** as **Next.js** (automatically detected).
3. Under **Build & Development Settings**, leave the defaults:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## 3. Environment Variables (Vercel Project Settings)

In the Vercel project configuration, go to **Settings** > **Environment Variables** and add:

| Variable Name | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://nadaverse.abarjun.online` | Canonical site URL for metadata, SEO, and OpenGraph cards |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com` (or your deployed FastAPI URL) | The backend endpoint for authentication and practice persistence |

> [!NOTE]
> Even if the backend API is not yet hosted, all client-side features (Web Audio Tanpura, Tala metronome, Just Intonation swara audition, Raga/Tala/Instrument library, and mock AI tutor responses) function standalone directly in the browser!

---

## 4. Connect Your Custom Domain (`nadaverse.abarjun.online`)

1. In your Vercel Project Dashboard, navigate to **Settings** > **Domains**.
2. Type `nadaverse.abarjun.online` into the input field and click **Add**.
3. Vercel will display the DNS record to configure in your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy, Hostinger):

### DNS Configuration

Add the following **CNAME** record in your DNS manager for `abarjun.online`:

| Type | Name / Host | Target / Value | TTL | Proxy Status (if Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `nadaverse` | `cname.vercel-dns.com` | Automatic / 300 | DNS Only (or Proxied) |

4. Once the DNS record propagates (usually 1–5 minutes), Vercel will automatically issue a free **Let's Encrypt SSL/TLS Certificate** and mark the domain as **Valid Configuration**.

---

## 5. Backend CORS Support

The backend has already been configured in `backend/app/core/config.py` and `backend/app/main.py` with:
- `https://nadaverse.abarjun.online` in the allowed CORS origins.
- `https://*.vercel.app` allowed via regex for all preview and branch deployments.
- Optional custom override via the `CORS_ORIGINS` environment variable.
