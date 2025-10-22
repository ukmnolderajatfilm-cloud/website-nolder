const testDeleteAPI = async () => {
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
        password: 'N0lderFilm2025'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success && loginResult.token) {
      console.log('✅ Login successful!');
      const realToken = loginResult.token;
      
      // Get current hero images to see what we can delete
      console.log('\n🔍 Getting current hero images...');
      const getResponse = await fetch('http://localhost:3000/api/admin/hero-images', {
        headers: {
          'Authorization': `Bearer ${realToken}`
        }
      });
      
      const getResult = await getResponse.json();
      console.log('Current images:', getResult.data?.heroImages?.length || 0);
      
      if (getResult.data?.heroImages?.length > 0) {
        const firstImage = getResult.data.heroImages[0];
        console.log(`\n🗑️ Testing DELETE for image ID: ${firstImage.id}`);
        
        // Test DELETE
        const deleteResponse = await fetch(`http://localhost:3000/api/admin/hero-images/${firstImage.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${realToken}`
          }
        });
        
        const deleteResult = await deleteResponse.json();
        console.log('DELETE Response Status:', deleteResponse.status);
        console.log('DELETE Response:', JSON.stringify(deleteResult, null, 2));
        
        // Check if image was actually deleted
        console.log('\n🔍 Checking if image was deleted...');
        const checkResponse = await fetch('http://localhost:3000/api/admin/hero-images', {
          headers: {
            'Authorization': `Bearer ${realToken}`
          }
        });
        
        const checkResult = await checkResponse.json();
        console.log('Images after delete:', checkResult.data?.heroImages?.length || 0);
        
      } else {
        console.log('No images to delete');
      }
      
    } else {
      console.log('❌ Login failed:', loginResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testDeleteAPI();
