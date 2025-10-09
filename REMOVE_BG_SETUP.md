# 🎨 Remove.bg API Setup Guide

## Overview
This project uses Remove.bg API for automatic background removal on member profile images in the user-facing cabinet section.

## Features
- ✅ **Automatic Background Removal**: Removes background from member photos automatically
- ✅ **Server-Side Processing**: All processing happens on the server for security
- ✅ **Smart Caching**: Processed images are cached to avoid redundant API calls
- ✅ **Graceful Degradation**: Falls back to original image if processing fails
- ✅ **Parallel Processing**: Processes multiple images simultaneously for better performance

## Setup Instructions

### 1. Get Remove.bg API Key

1. Visit [https://www.remove.bg/api](https://www.remove.bg/api)
2. Sign up for a free account
3. Navigate to your API dashboard
4. Copy your API key

**Free Tier Limits:**
- 50 API calls per month
- Preview quality images
- Perfect for testing and small projects

**Paid Plans:**
- More API calls
- Higher quality images
- Faster processing

### 2. Configure Environment Variable

Add your API key to `.env` file:

```env
REMOVE_BG_API_KEY="your-api-key-here"
```

**Important:** Never commit your `.env` file to version control!

### 3. Create Processed Images Directory

The system will automatically create this directory, but you can create it manually:

```bash
mkdir -p public/uploads/processed
```

### 4. Restart Development Server

```bash
npm run dev
```

## How It Works

### Architecture

```
User Upload → Admin Panel → Database → User Page → Background Removal API → Cached Result → Display
```

### Flow Diagram

1. **Admin uploads image** → Stored in `/public/uploads/`
2. **User visits page** → Fetches cabinet data from `/api/cabinets/active`
3. **Client requests processing** → Calls `/api/remove-bg` for each image
4. **Server checks cache** → If processed version exists, return immediately
5. **If not cached** → Call Remove.bg API
6. **Save result** → Store in `/public/uploads/processed/`
7. **Return URL** → Client displays processed image

### Caching Strategy

- **Cache Location**: `/public/uploads/processed/`
- **Naming Convention**: `nobg-{original-filename}`
- **Cache Check**: Before calling API, check if processed version exists
- **Benefits**: 
  - Saves API calls
  - Faster load times
  - Reduces costs

### Error Handling

The system implements graceful degradation:

1. **No API Key**: Returns original image with warning
2. **API Error**: Returns original image with error log
3. **Network Error**: Returns original image
4. **Invalid Image**: Returns original image

This ensures the site always works, even if background removal fails.

## Best Practices

### 1. Optimize API Usage

```javascript
// ✅ Good: Process only when needed
if (!member.image || member.image === '/Images/nolder-logo.png') {
  return member; // Skip default images
}

// ✅ Good: Check cache first
if (existsSync(processedPath)) {
  return cachedImage;
}
```

### 2. Parallel Processing

```javascript
// ✅ Good: Process all images in parallel
const processedMembers = await Promise.all(
  cabinet.members.map(async (member) => {
    return await processImage(member);
  })
);
```

### 3. Error Handling

```javascript
// ✅ Good: Always have fallback
try {
  const processed = await removeBackground(image);
  return processed;
} catch (error) {
  console.error('Background removal failed:', error);
  return originalImage; // Fallback
}
```

## Testing

### Test Without API Key

1. Don't set `REMOVE_BG_API_KEY` in `.env`
2. Visit user page
3. Should see original images (graceful degradation)

### Test With API Key

1. Set valid API key in `.env`
2. Upload member photo in admin panel
3. Visit user page
4. First load: API call made, image processed
5. Second load: Cached version used (faster)

### Monitor API Usage

Check your Remove.bg dashboard:
- API calls made
- Remaining quota
- Error logs

## Troubleshooting

### Images Not Processing

**Check:**
1. API key is correct in `.env`
2. Server restarted after adding API key
3. Image URL is accessible
4. Check console for errors

### API Quota Exceeded

**Solutions:**
1. Wait for monthly reset
2. Upgrade to paid plan
3. Use cached images (they persist)

### Slow Performance

**Optimizations:**
1. Ensure caching is working
2. Check network speed
3. Consider processing images on upload instead of on page load
4. Use CDN for processed images

## Advanced Configuration

### Process on Upload (Alternative Approach)

Instead of processing on page load, you can process when admin uploads:

```javascript
// In upload API route
const processedImage = await removeBackground(uploadedImage);
// Save both original and processed
```

**Pros:**
- Faster page load for users
- Better user experience
- Predictable API usage

**Cons:**
- Slower upload process
- Admin waits for processing

### Custom Processing Options

Modify `/api/remove-bg/route.js`:

```javascript
req.write(JSON.stringify({
  image_url: imageUrl,
  size: 'auto',        // or 'preview', 'full', 'medium'
  format: 'png',       // or 'jpg', 'zip'
  bg_color: '#ffffff', // Add background color
  channels: 'rgba'     // or 'alpha'
}));
```

## API Reference

### POST /api/remove-bg

**Request:**
```javascript
FormData {
  imageUrl: '/uploads/image.jpg'
}
```

**Response:**
```json
{
  "success": true,
  "processedUrl": "/uploads/processed/nobg-image.jpg",
  "cached": false
}
```

## Cost Estimation

### Free Tier (50 calls/month)
- Perfect for: Testing, small teams (< 10 members)
- Cost: $0/month

### Paid Plans
- **Subscription**: $9/month (500 calls)
- **Pay-as-you-go**: $0.20/image
- **Enterprise**: Custom pricing

### Optimization Tips
1. Cache aggressively
2. Process only new/updated images
3. Consider batch processing
4. Use webhooks for async processing

## Security Considerations

1. **API Key Protection**: Never expose in client-side code
2. **Rate Limiting**: Implement on your API endpoint
3. **Input Validation**: Validate image URLs
4. **File Size Limits**: Prevent abuse
5. **Access Control**: Limit who can trigger processing

## Support

- **Remove.bg Docs**: https://www.remove.bg/api/documentation
- **API Status**: https://status.remove.bg/
- **Support Email**: support@remove.bg

## License

This integration follows Remove.bg's Terms of Service:
https://www.remove.bg/terms
