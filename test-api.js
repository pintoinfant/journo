// Simple test script to verify API endpoints
const baseUrl = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Testing Journo API endpoints...\n');

    // Test seed endpoint
    console.log('1. Seeding database...');
    const seedResponse = await fetch(`${baseUrl}/api/seed`, { method: 'POST' });
    const seedData = await seedResponse.json();
    console.log('✅ Database seeded:', seedData.message);
    console.log(`   - Users: ${seedData.users}`);
    console.log(`   - Listings: ${seedData.listings}`);
    console.log(`   - Rides: ${seedData.rides}\n`);

    // Test listings endpoint
    console.log('2. Testing listings endpoint...');
    const listingsResponse = await fetch(`${baseUrl}/api/listings`);
    const listingsData = await listingsResponse.json();
    console.log('✅ Listings fetched:', listingsData.listings.length, 'listings');
    listingsData.listings.forEach((listing, index) => {
      console.log(`   ${index + 1}. ${listing.title} - ${listing.location.address} ($${listing.price})`);
    });
    console.log('');

    // Test rides endpoint
    console.log('3. Testing rides endpoint...');
    const ridesResponse = await fetch(`${baseUrl}/api/rides`);
    const ridesData = await ridesResponse.json();
    console.log('✅ Rides fetched:', ridesData.rides.length, 'rides');
    ridesData.rides.forEach((ride, index) => {
      console.log(`   ${index + 1}. ${ride.from.address} → ${ride.to.address} ($${ride.price})`);
    });
    console.log('');

    // Test search functionality
    console.log('4. Testing search functionality...');
    const searchResponse = await fetch(`${baseUrl}/api/listings?q=Oslo`);
    const searchData = await searchResponse.json();
    console.log('✅ Search results:', searchData.listings.length, 'listings found for "Oslo"');
    console.log('');

    console.log('🎉 All API tests passed! The app is ready for demo.');
    console.log('\n📱 You can now:');
    console.log('   - Visit http://localhost:3001 to see the app');
    console.log('   - Browse listings in Couch Surfing');
    console.log('   - Search for rides in RideShare');
    console.log('   - View your profile (sign in with demo credentials)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the dev server is running: yarn dev');
  }
}

testAPI();
