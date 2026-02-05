# Deployment Guide - Render

## Status: ✅ READY FOR DEPLOYMENT

Your Clinical AI Agent is fully configured for Render deployment!

## What's Configured

- ✅ Backend: FastAPI + Uvicorn on port 8000
- ✅ Frontend: Next.js on port 3000  
- ✅ Database: PostgreSQL 13 (free tier)
- ✅ Environment variables setup
- ✅ Health checks configured
- ✅ GitHub repository: https://github.com/Thami-debugger/Rental-ai-agent

## Render Deployment Steps

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Sign in with GitHub

### 2. Create Backend Service
1. Click "New +" → "Web Service"
2. Connect GitHub repo: `Rental-ai-agent`
3. Configure:
   - **Name**: `clinical-ai-backend`
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. Add Environment Variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: [Paste your OpenAI API key]

5. Click "Create Web Service"
6. **Note the Backend URL** (e.g., `https://clinical-ai-backend.onrender.com`)

### 3. Create Frontend Service
1. Click "New +" → "Web Service"
2. Connect same repo: `Rental-ai-agent`
3. Configure:
   - **Name**: `clinical-ai-frontend`
   - **Runtime**: Node 18
   - **Root Directory**: `clinic_app`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. Add Environment Variables:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: [Backend URL from step 2, e.g., `https://clinical-ai-backend.onrender.com`]

5. Click "Create Web Service"

### 4. Deploy Database (Optional)
1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `patient-db`
   - **Plan**: Free
3. Note the connection string for future use

### 5. Wait for Deployment
Both services will build and deploy. Monitor in the Dashboard:
- Build logs appear in real-time
- Green status = Service is running

### 6. Access Your Application
- **Frontend**: `https://clinical-ai-frontend.onrender.com`
- **Backend Health**: `https://clinical-ai-backend.onrender.com/health`

## Important Notes

### API Endpoint Configuration
The frontend environment variable `NEXT_PUBLIC_API_URL` must point to your backend service for API calls to work.

### First Load Speed
- Free tier services spin down after 15 minutes of inactivity
- First request may take 30+ seconds to wake up
- Subsequent requests are normal speed

### Environment Variables
Keep your `OPENAI_API_KEY` secure:
- Never commit it to GitHub
- Set it only in Render dashboard
- Rotate keys periodically

### Database (If Using)
Currently using mock data in `clinical_tools.py`. To use PostgreSQL:
1. Update `clinical_tools.py` to connect to database
2. Add database connection string as environment variable
3. Run migrations

## Troubleshooting

### Backend not responding
1. Check deployment logs in Render dashboard
2. Verify `OPENAI_API_KEY` is set correctly
3. Check that start command is: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`

### Frontend shows errors
1. Verify `NEXT_PUBLIC_API_URL` points to your backend
2. Check that it includes `https://` (not http)
3. No trailing slash in URL

### Build fails
1. Ensure `requirements.txt` and `package.json` are in root and `clinic_app/` respectively
2. Check Python and Node versions match configuration
3. Review build logs for specific errors

## Local Development (Before Deploying)

Test locally first:
```powershell
# Terminal 1 - Backend
cd "C:\Users\nkosi\My Projects\Rental ai agent"
python api_server.py

# Terminal 2 - Frontend
cd "C:\Users\nkosi\My Projects\Rental ai agent\clinic_app"
npm run dev
```

Then open: http://localhost:3000

## Production Checklist

- [ ] Set `OPENAI_API_KEY` in Render dashboard
- [ ] Set `NEXT_PUBLIC_API_URL` to your backend URL
- [ ] Backend service deployed and showing green status
- [ ] Frontend service deployed and showing green status
- [ ] Frontend loads without errors
- [ ] Backend health check returns 200 OK
- [ ] Agent can query patient data
- [ ] Chat interface works

## Support & Documentation

See also:
- [render.yaml](./render.yaml) - Service configuration
- [Procfile](./Procfile) - Backend startup config
- [api_server.py](./api_server.py) - Backend code
- [clinic_app/](./clinic_app/) - Frontend code

---

**Ready to deploy?** Follow the steps above and your Clinical AI Agent will be live in minutes!
