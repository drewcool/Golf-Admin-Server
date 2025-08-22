# Golf Backend Deployment Guide

## Overview
This guide helps you deploy your localhost API server to production at IP `13.50.244.87:5000` to replace the problematic external production server.

## Prerequisites
- Node.js 18+ installed on your production server
- PM2 installed globally: `npm install -g pm2`
- Your production server accessible at `13.50.244.87`

## Deployment Steps

### 1. Server Setup
```bash
# On your production server (13.50.244.87)
cd /path/to/your/project
npm install
```

### 2. Environment Configuration
Create a `.env` file on your production server:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start Production Server
```bash
# Start with PM2 for production
pm2 start ecosystem.config.js --env production

# Or start directly
NODE_ENV=production npm start
```

### 4. Verify Deployment
```bash
# Check if server is running
curl http://13.50.244.87:5000/api/status

# Check PM2 status
pm2 status
pm2 logs golf-backend
```

### 5. Frontend Configuration
Your frontend is now configured to use `http://13.50.244.87:5000/api` as the production API.

## API Endpoints
- **Base URL**: `http://13.50.244.87:5000/api`
- **Health Check**: `GET /api/status`
- **Images**: `http://13.50.244.87:5000/images/`
- **Admin Routes**: `/api/admin/*`
- **Golf Routes**: `/api/golf/*`
- **User Routes**: `/api/user/*`

## CORS Configuration
The server is configured to allow requests from:
- `http://13.50.244.87`
- `https://13.50.244.87`
- `http://13.50.244.87:5173`
- `https://13.50.244.87:5173`
- `http://localhost:5173` (for development)

## Troubleshooting
1. **Port 5000 blocked**: Change PORT in .env and update frontend URLs
2. **CORS issues**: Check allowed origins in index.js
3. **Database connection**: Verify MongoDB connection string
4. **PM2 issues**: Check logs with `pm2 logs golf-backend`

## Monitoring
```bash
# View real-time logs
pm2 logs golf-backend --lines 100

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart golf-backend
```

## Security Notes
- Ensure your production server has a firewall
- Use HTTPS in production (consider using nginx as reverse proxy)
- Keep JWT_SECRET secure and unique
- Regularly update dependencies
