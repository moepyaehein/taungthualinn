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
3. Make sure the model artifact is available to the service
4. Confirm:
   - `/health` returns `200`
   - `/predict` returns valid JSON

## Important note about model artifacts

Current `.gitignore` excludes:

- `ml/artifacts/`
- `ml/reports/`

That means the trained model artifact is not committed.

So for FastAPI production you need one of these:

1. Train during deployment
2. Upload the artifact separately
3. Store the artifact in persistent storage and load it at runtime

## Suggested next improvement

To make deployment easier, the next step should be:

1. add artifact bootstrap logic for FastAPI production
2. or add a build/download step for `recommendation_forecast.joblib`

Without that, the FastAPI code is deployed but may still fail if the artifact is missing.
