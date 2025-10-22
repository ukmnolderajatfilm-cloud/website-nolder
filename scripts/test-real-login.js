const jwt = require('jsonwebtoken');

// Test with actual login API
const testLoginAndHeroAPI = async () => {
  try {
    // First, login to get a real token
    console.log('🔐 Testing login to get real token...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'AdminN0lder',
        password: 'admin123'
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    
    if (loginResult.success && loginResult.token) {
      console.log('✅ Login successful!');
      const realToken = loginResult.token;
      
      // Now test POST hero images with real token
      console.log('\n📤 Testing POST /api/admin/hero-images with real token...');
      const postResponse = await fetch('http://localhost:3000/api/admin/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${realToken}`
        },
        body: JSON.stringify({
          imageUrl: 'https://picsum.photos/id/9999/600/900?grayscale',
          imagePath: 'https://picsum.photos/id/9999/600/900?grayscale',
          url: '#',
          height: 400,
          order: 6
        })
      });
      
      const postResult = await postResponse.json();
      console.log('POST Response Status:', postResponse.status);
      console.log('POST Response:', JSON.stringify(postResult, null, 2));
      
    } else {
      console.log('❌ Login failed:', loginResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testLoginAndHeroAPI();
