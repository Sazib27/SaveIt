# SaveIt - Installation & Setup Guide

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v14+ recommended)
- **MongoDB** (Local or Cloud - MongoDB Atlas)
- **yt-dlp** (for media downloading)
- **ffmpeg** (for media processing)
- **Git**

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Sazib27/SaveIt.git
cd SaveIt
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Copy the `.env.example` file and create `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saveit

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password

# Frontend
FRONTEND_URL=http://localhost:3000

# Paths
YTDLP_PATH=/usr/local/bin/yt-dlp
FFMPEG_PATH=/usr/bin/ffmpeg
```

#### Install System Dependencies

**For Ubuntu/Debian:**

```bash
# Install yt-dlp
sudo apt-get update
sudo apt-get install yt-dlp

# Install ffmpeg
sudo apt-get install ffmpeg

# Verify installations
yt-dlp --version
ffmpeg -version
```

**For macOS:**

```bash
# Install yt-dlp
brew install yt-dlp

# Install ffmpeg
brew install ffmpeg

# Verify installations
yt-dlp --version
ffmpeg -version
```

**For Windows:**

- Download yt-dlp from: https://github.com/yt-dlp/yt-dlp/releases
- Download ffmpeg from: https://ffmpeg.org/download.html
- Add both to PATH

#### Run Backend

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

The frontend is static HTML/CSS/JavaScript and doesn't require a build step.

Simply open the files in a web server or use a simple HTTP server:

```bash
# Using Python 3
python -m http.server 3000 --directory frontend

# Using Node.js (http-server)
npm install -g http-server
http-server frontend -p 3000
```

Access the frontend at `http://localhost:3000`

## 🗄️ Database Setup

### MongoDB Cloud (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create an account and login
3. Create a new cluster
4. Create a database user
5. Whitelist your IP
6. Copy the connection string
7. Replace `username` and `password` in `.env`

### MongoDB Local

```bash
# Install MongoDB Community Edition
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/saveit
```

## 📱 API Endpoints

### Authentication

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
POST   /api/auth/change-password   - Change password
POST   /api/auth/logout            - Logout user
```

### Downloads

```
POST   /api/download/fetch         - Fetch media metadata
POST   /api/download/start         - Start download
GET    /api/download/status/:id    - Get download status
GET    /api/download/cancel/:id    - Cancel download
GET    /api/download/history       - Get download history
DELETE /api/download/history/:id   - Delete download record
```

### Payments

```
POST   /api/payment/initiate       - Start payment process
POST   /api/payment/verify         - Verify payment
GET    /api/payment/history        - Get payment history
GET    /api/payment/status/:id     - Check payment status
POST   /api/payment/ipn            - Payment IPN webhook
```

### Admin

```
GET    /api/admin/dashboard        - Dashboard stats
GET    /api/admin/users            - Get all users
PUT    /api/admin/users/:id        - Update user
DELETE /api/admin/users/:id        - Delete user
GET    /api/admin/analytics/downloads - Download analytics
GET    /api/admin/analytics/revenue   - Revenue analytics
```

## 🔧 Configuration Guide

### SSLCommerz Setup

1. Go to https://www.sslcommerz.com
2. Create a merchant account
3. Get your Store ID and Store Password
4. Add to `.env`:

```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com  # Sandbox testing
```

### yt-dlp Configuration

```bash
# Update yt-dlp
yt-dlp -U

# Check configuration
yt-dlp --version

# Test download
yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --list-formats
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@1234",
    "fullName": "Test User"
  }'
```

## 📦 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for VPS and production setup.

## 🆘 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:** Ensure MongoDB is running and connection string is correct

### yt-dlp Not Found

```
Error: yt-dlp command not found
```

**Solution:** Install yt-dlp or update the path in `.env`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### CORS Error

**Solution:** Check `FRONTEND_URL` in `.env` matches your frontend URL

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [SSLCommerz Documentation](https://developer.sslcommerz.com/)

## 💡 Tips

- Use `.env.example` as a template and never commit `.env`
- Regularly update dependencies with `npm update`
- Monitor logs in `logs/` directory
- Use PM2 for production process management
- Enable HTTPS in production
- Use rate limiting to prevent abuse
- Implement regular backups for MongoDB

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running and accessible
- [ ] yt-dlp installed and working
- [ ] ffmpeg installed and working
- [ ] `.env` file configured
- [ ] Backend started successfully
- [ ] Frontend accessible
- [ ] Login/Register working
- [ ] Download functionality working
- [ ] Admin panel accessible

---

**Happy downloading! 🎬**

For issues and support, visit: https://github.com/Sazib27/SaveIt/issues
