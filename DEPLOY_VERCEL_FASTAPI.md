# Deploying Next.js + FastAPI

This project now uses two services in production:

1. `Next.js` app
2. `FastAPI` recommendation service

The recommendation pages will not work in production unless both services are deployed.

## Why this split is needed

The app now calls:

- `FASTAPI_BASE_URL/predict`

Locally, the fallback is:

- `http://127.0.0.1:8000`

That fallback is only for local development.

In production, `FASTAPI_BASE_URL` must be set explicitly.

## Production architecture

Recommended setup:

1. Deploy Next.js app on Vercel
2. Deploy FastAPI app on a Python host
3. Set `FASTAPI_BASE_URL` in Vercel

Good FastAPI hosting options:

1. Railway
2. Render
3. Fly.io
4. VPS

## What Vercel needs

In the Vercel project settings, add:

- `FASTAPI_BASE_URL=https://your-fastapi-domain`

Example:

```text
FASTAPI_BASE_URL=https://taung-thu-ml-production.up.railway.app
```

Then redeploy the Vercel project.

## What happens if FASTAPI_BASE_URL is missing

In production, the app now returns a controlled `503` error instead of silently trying `127.0.0.1`.

This helps because:

- deploys are easier to debug
- the failure reason is explicit
- localhost assumptions do not leak into production

## FastAPI service requirements

Your FastAPI deployment must expose:

- `GET /health`
- `POST /predict`

Main file:

- [api.py](/d:/climateAi/taung-thu-app/ml/api.py)

## Local development

Start FastAPI:

```powershell
npm run ml:api
```

Start Next.js:

```powershell
npm run dev
```

Local fallback:

- Next.js uses `http://127.0.0.1:8000` only when `NODE_ENV` is not `production`

## Deployment checklist

### Next.js / Vercel

1. Push latest code to GitHub
2. Connect repo to Vercel
3. Add environment variable:
   - `FASTAPI_BASE_URL`
4. Redeploy

### FastAPI

1. Deploy Python service
2. Install dependencies from:
   - [requirements.txt](/d:/climateAi/taung-thu-app/ml/requirements.txt)
3. Confirm the datasets are present in the deployed service
4. On first boot, FastAPI can now train and save the artifact automatically if it is missing
5. Confirm:
   - `/health` returns `200`
   - `/predict` returns valid JSON

## Important note about model artifacts

Current `.gitignore` excludes:

- `ml/artifacts/`
- `ml/reports/`

That means the trained model artifact is not committed.

The FastAPI service now has bootstrap logic:

1. if artifact exists, load it
2. if artifact is missing, train from the committed datasets
3. save a fresh artifact under `ml/artifacts/`

Because of that, first startup on a new Python host may take longer while the model is trained.

## Suggested next improvement

To make deployment easier, the next step should be:

1. move the artifact to persistent storage for faster restarts
2. or prebuild the artifact during CI/CD and upload it before boot
