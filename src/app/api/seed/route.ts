import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST() {
  try {
    // Create mock users
    const mockUsers = [
      {
        userId: 'user1',
        worldId: 'world_id_1',
        email: 'lina@example.com',
        phone: '+1234567890',
        profile: {
          name: 'Lina • Designer',
          bio: 'Creative designer from Oslo, love hosting travelers and sharing local culture',
          photo: '/api/placeholder/100/100',
          location: 'Oslo, Norway',
          languages: ['English', 'Norwegian'],
          verificationLevel: 'orb+' as const,
        },
        createdAt: new Date(),
        isHost: true,
        isDriver: false,
      },
      {
        userId: 'user2',
        worldId: 'world_id_2',
        email: 'ravi@example.com',
        phone: '+1234567891',
        profile: {
          name: 'Ravi • Cyclist',
          bio: 'Passionate cyclist and travel enthusiast from Berlin',
          photo: '/api/placeholder/100/100',
          location: 'Berlin, Germany',
          languages: ['English', 'German', 'Hindi'],
          verificationLevel: 'orb' as const,
        },
        createdAt: new Date(),
        isHost: true,
        isDriver: true,
      },
      {
        userId: 'user3',
        worldId: 'world_id_3',
        email: 'june@example.com',
        phone: '+1234567892',
        profile: {
          name: 'June • Chef',
          bio: 'Professional chef in Lisbon, love cooking for guests',
          photo: '/api/placeholder/100/100',
          location: 'Lisbon, Portugal',
          languages: ['English', 'Portuguese', 'Spanish'],
          verificationLevel: 'orb+' as const,
        },
        createdAt: new Date(),
        isHost: true,
        isDriver: false,
      },
      {
        userId: 'user4',
        worldId: 'world_id_4',
        email: 'ava@example.com',
        phone: '+1234567893',
        profile: {
          name: 'Ava • Driver',
          bio: 'Frequent driver between cities, love meeting new people',
          photo: '/api/placeholder/100/100',
          location: 'Amsterdam, Netherlands',
          languages: ['English', 'Dutch'],
          verificationLevel: 'orb' as const,
        },
        createdAt: new Date(),
        isHost: false,
        isDriver: true,
      },
    ];

    // Create mock listings
    const mockListings = [
      {
        hostId: 'user1',
        type: 'couch' as const,
        title: 'Cozy Designer Couch in Oslo',
        description: 'Beautiful modern apartment in central Oslo. Perfect for travelers who want to experience the city like a local.',
        photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        location: {
          address: 'Oslo, Norway',
          coordinates: [10.7522, 59.9139] as [number, number],
        },
        price: 0,
        availability: [
          { date: new Date('2024-01-15'), available: true },
          { date: new Date('2024-01-16'), available: true },
          { date: new Date('2024-01-17'), available: false },
        ],
        amenities: ['WiFi', 'Kitchen', 'Washing Machine'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hostId: 'user2',
        type: 'private_room' as const,
        title: 'Cyclist\'s Spare Room in Berlin',
        description: 'Comfortable private room in a shared apartment. Great for cyclists and outdoor enthusiasts.',
        photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        location: {
          address: 'Berlin, Germany',
          coordinates: [13.4050, 52.5200] as [number, number],
        },
        price: 25,
        availability: [
          { date: new Date('2024-01-15'), available: true },
          { date: new Date('2024-01-16'), available: true },
          { date: new Date('2024-01-17'), available: true },
        ],
        amenities: ['WiFi', 'Bike Storage', 'Gym Access'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hostId: 'user3',
        type: 'entire_place' as const,
        title: 'Chef\'s Apartment in Lisbon',
        description: 'Entire apartment with fully equipped kitchen. Perfect for food lovers who want to cook.',
        photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        location: {
          address: 'Lisbon, Portugal',
          coordinates: [-9.1393, 38.7223] as [number, number],
        },
        price: 45,
        availability: [
          { date: new Date('2024-01-15'), available: true },
          { date: new Date('2024-01-16'), available: false },
          { date: new Date('2024-01-17'), available: true },
        ],
        amenities: ['WiFi', 'Full Kitchen', 'Balcony', 'Air Conditioning'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create mock rides
    const mockRides = [
      {
        driverId: 'user2',
        from: {
          address: 'Berlin, Germany',
          coordinates: [13.4050, 52.5200] as [number, number],
        },
        to: {
          address: 'Amsterdam, Netherlands',
          coordinates: [4.9041, 52.3676] as [number, number],
        },
        date: new Date('2024-01-15'),
        time: '17:30',
        seats: 2,
        price: 12,
        description: 'Comfortable ride from Berlin to Amsterdam. We can stop for coffee along the way!',
        status: 'active' as const,
        passengers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        driverId: 'user4',
        from: {
          address: 'Amsterdam, Netherlands',
          coordinates: [4.9041, 52.3676] as [number, number],
        },
        to: {
          address: 'Brussels, Belgium',
          coordinates: [4.3528, 50.8503] as [number, number],
        },
        date: new Date('2024-01-15'),
        time: '18:10',
        seats: 1,
        price: 15,
        description: 'Quick trip to Brussels. Professional driver with clean car.',
        status: 'active' as const,
        passengers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        driverId: 'user2',
        from: {
          address: 'Berlin, Germany',
          coordinates: [13.4050, 52.5200] as [number, number],
        },
        to: {
          address: 'Prague, Czech Republic',
          coordinates: [14.4378, 50.0755] as [number, number],
        },
        date: new Date('2024-01-16'),
        time: '09:00',
        seats: 3,
        price: 9,
        description: 'Early morning departure to Prague. Great for a day trip!',
        status: 'active' as const,
        passengers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert mock data
    for (const user of mockUsers) {
      await DatabaseService.createUser(user);
    }

    for (const listing of mockListings) {
      await DatabaseService.createListing(listing);
    }

    for (const ride of mockRides) {
      await DatabaseService.createRide(ride);
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      users: mockUsers.length,
      listings: mockListings.length,
      rides: mockRides.length,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
