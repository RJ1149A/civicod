# Deployment Guide for Civic Visibility

## 🚀 Quick Deploy Options

### 1. Netlify (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
# Option 1: Drag and drop the 'dist' folder to Netlify
# Option 2: Connect your GitHub repository to Netlify
```

**Netlify Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: None required

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. GitHub Pages
```bash
# Add to package.json
"homepage": "https://your-username.github.io/civic-visibility",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### 4. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Environment Setup

### Required Environment Variables
```bash
# Create .env file (optional for current setup)
VITE_APP_TITLE=Civic Visibility
VITE_APP_DESCRIPTION=Report and track local community issues
```

### Build Commands
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Start Production Server
npm start
```

## 📱 PWA Features

The app includes:
- ✅ Service Worker for offline support
- ✅ Web App Manifest for mobile installation
- ✅ Responsive design for all devices
- ✅ Geolocation support
- ✅ Local storage for data persistence

## 🌐 Domain Configuration

### Update these files with your domain:
1. `package.json` - Update homepage URL
2. `public/sitemap.xml` - Update domain URLs
3. `public/robots.txt` - Update sitemap URL
4. `index.html` - Update meta tags and Open Graph URLs

### Example:
```json
{
  "homepage": "https://civic-visibility.netlify.app"
}
```

## 🔒 Security Considerations

### For Production:
1. **HTTPS Required** - Geolocation and service workers require HTTPS
2. **CSP Headers** - Add Content Security Policy headers
3. **Rate Limiting** - Consider implementing rate limiting for submissions
4. **Data Validation** - Add server-side validation for production

### Recommended CSP Headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;
```

## 📊 Performance Optimization

### Build Optimizations:
- ✅ Code splitting implemented
- ✅ Tree shaking enabled
- ✅ Minification configured
- ✅ Gzip compression recommended

### CDN Recommendations:
- Cloudflare (Free tier available)
- AWS CloudFront
- Google Cloud CDN

## 🐛 Troubleshooting

### Common Issues:

1. **Geolocation not working**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Test on mobile devices

2. **Map not loading**
   - Check internet connection
   - Verify OpenStreetMap tiles are accessible
   - Check browser console for errors

3. **Service Worker issues**
   - Clear browser cache
   - Check HTTPS requirement
   - Verify service worker registration

### Debug Commands:
```bash
# Check build output
npm run build

# Test production build locally
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint
```

## 📈 Analytics Setup

### Google Analytics (Optional):
```html
<!-- Add to index.html head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Deployment Checklist

- [ ] Update domain URLs in configuration files
- [ ] Test production build locally
- [ ] Verify HTTPS is enabled
- [ ] Test geolocation functionality
- [ ] Check service worker registration
- [ ] Test on mobile devices
- [ ] Verify email submission functionality
- [ ] Test offline capabilities
- [ ] Check performance scores
- [ ] Set up monitoring/analytics

## 📞 Support

For deployment issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test on different browsers and devices
4. Check hosting platform logs

---

**Ready for deployment! 🎉** 

## 🚀 **Deployment Ready!**

Your Civic Visibility app is now fully optimized and ready for deployment! Here's what I've prepared:

### **✅ Build Status: SUCCESS**
- All TypeScript errors resolved
- Production build completed successfully
- Code splitting and optimization implemented

### **🚀 Ready for Deployment**

**Quick Deploy Options:**

1. **Netlify (Recommended):**
   ```bash
   npm run build
   # Drag the 'dist' folder to Netlify
   ```

2. **Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **GitHub Pages:**
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

### **🏛️ Municipal Email System**
- **8 Indian Municipal Corporations** configured
- **Pre-filled email templates** for each municipality
- **Direct email client integration**
- **Copy to clipboard functionality**

### **📱 PWA Features**
- Service Worker for offline support
- Web App Manifest for mobile installation
- Responsive design for all devices
- Geolocation support

### **🔧 Production Optimizations**
- Code splitting (vendor, router, map, utils)
- Tree shaking and minification
- SEO optimization with meta tags
- Sitemap and robots.txt included

### **📁 Files Created for Deployment:**
- `dist/` - Production build folder
- `public/_redirects` - SPA routing support
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- `public/sitemap.xml` - SEO sitemap
- `public/robots.txt` - Search engine crawling
- `deploy.md` - Comprehensive deployment guide
- `DEPLOYMENT_READY.md` - Deployment summary

Your app is now ready to help citizens report issues and submit them to nearby Indian municipal corporations! 🏛️ 