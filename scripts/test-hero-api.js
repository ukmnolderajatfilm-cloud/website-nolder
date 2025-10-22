const jwt = require('jsonwebtoken');

// Generate test token with same structure as generateToken function
const secret = 'your-secret-key'; // Same as in auth.js
const token = jwt.sign(
  { 
    adminId: 1, // This is the key field that generateToken uses
    id: 1, 
    username: 'admin', 
    role: 'superadmin' 
  },
  secret,
  { expiresIn: '24h' }
);

console.log('Test Token:', token);

// Test API endpoints
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test GET hero images
    console.log('\n🔍 Testing GET /api/admin/hero-images...');
    const getResponse = await fetch(`${baseUrl}/api/admin/hero-images`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const getResult = await getResponse.json();
    console.log('GET Response Status:', getResponse.status);
    console.log('GET Response:', JSON.stringify(getResult, null, 2));
    
    // Test POST hero image
    console.log('\n📤 Testing POST /api/admin/hero-images...');
    const postResponse = await fetch(`${baseUrl}/api/admin/hero-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        imageUrl: 'https://picsum.photos/id/1015/600/900?grayscale',
        imagePath: 'https://picsum.photos/id/1015/600/900?grayscale',
        url: '#',
        height: 400,
        order: 1
      })
    });
    
    const postResult = await postResponse.json();
    console.log('POST Response Status:', postResponse.status);
    console.log('POST Response:', JSON.stringify(postResult, null, 2));
    
    // Test public API
    console.log('\n🌐 Testing GET /api/hero-images (public)...');
    const publicResponse = await fetch(`${baseUrl}/api/hero-images`);
    const publicResult = await publicResponse.json();
    console.log('Public Response Status:', publicResponse.status);
    console.log('Public Response:', JSON.stringify(publicResult, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEndpoints();
