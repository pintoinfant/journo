# Journo - Travel with Verified Humans

A World mini app that combines travel hosting (couchsurfing) and ridesharing with cryptographic trust through World ID verification.

## Features

- **World ID Verification**: Every user is cryptographically verified as a unique human
- **Couch Surfing**: Find and offer free accommodation with verified hosts
- **Ride Sharing**: Share rides with trusted, verified drivers
- **Smart Contracts**: Secure escrow system for safe transactions
- **Real-time Search**: Find listings and rides by location and date

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- World ID app credentials

### Environment Setup

Create a `.env.local` file:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_ID=your_world_app_id
NEXT_PUBLIC_ACTION_ID=your_action_id
```

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# In another terminal, seed the database
yarn seed
```

### Smart Contracts (Optional)

```bash
# Install Hardhat
yarn add -D hardhat @nomicfoundation/hardhat-toolbox

# Deploy contracts to Sepolia testnet
yarn deploy:contracts
```

## Demo Flow

1. **Sign In**: Click "Sign In with World ID" (demo mode uses mock authentication)
2. **Browse Listings**: Go to Couch Surfing to see verified host listings
3. **Search Rides**: Go to RideShare to find available rides
4. **View Profile**: Check your verification status and travel stats

## API Endpoints

- `GET /api/listings` - Get all listings (with optional search)
- `POST /api/listings` - Create new listing
- `GET /api/rides` - Get all rides (with optional search)
- `POST /api/rides` - Create new ride
- `GET /api/bookings` - Get bookings by guest/host
- `POST /api/bookings` - Create booking
- `POST /api/seed` - Seed database with mock data

## Database Schema

### Users
- World ID verification
- Profile information
- Host/Driver status

### Listings
- Property details
- Location and pricing
- Availability calendar

### Rides
- Route information
- Driver details
- Seat availability

### Bookings
- Guest/Host relationship
- Payment status
- Transaction hash

## Tech Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js with World ID
- **Blockchain**: Solidity, Hardhat
- **UI Components**: Radix UI, Lucide React

## Development

The app is structured for rapid development with:

- Mock data seeding for immediate testing
- Responsive design for mobile-first experience
- Glass morphism UI with dark theme
- Real-time search and filtering
- Type-safe API routes

## Demo Data

The seed script creates:
- 4 verified users with different verification levels
- 3 property listings (couch, private room, entire place)
- 3 active rides between major European cities
- Sample bookings and ride requests

## Next Steps

- Integrate real World ID verification
- Add payment processing
- Implement real-time messaging
- Add review and rating system
- Deploy to production

## License

MIT License - see LICENSE file for details