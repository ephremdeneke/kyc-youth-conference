# Vercel Deployment Guide

## Prerequisites
- GitHub repository with the project code
- Vercel account (free tier works)
- Google Apps Script Web App URL

## Deployment Steps

### 1. Prepare Environment Variables
In Vercel dashboard, add the following environment variable:
- `VITE_API_URL`: Your Google Apps Script Web App URL (e.g., https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec)

### 2. Configure Vercel Settings
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Deploy
1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure settings as above
4. Click "Deploy"

### 4. Post-Deployment
- Test all routes (Home, Register, Login, Dashboard)
- Verify API connectivity
- Check mobile responsiveness
- Test QR code generation and download

## Troubleshooting
- **404 errors**: The vercel.json rewrites should handle client-side routing
- **API errors**: Ensure VITE_API_URL is set correctly in Vercel environment variables
- **Build failures**: Check that all dependencies are in package.json

## Local Testing
```bash
cd frontend
npm install
npm run build
npm run preview
```
