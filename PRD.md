# Journo - Hackathon Product Requirements Document

**Project:** Journo - Travel with Verified Humans  
**Hackathon:** World Mini App Hackathon  
**Duration:** 36 hours  
**Team Size:** [Your team size]  
**Version:** 1.0  
**Last Updated:** [Current Date]

## Executive Summary

Journo is a World mini app that combines travel hosting (couchsurfing) and ridesharing with cryptographic trust through World ID verification. Users can find verified hosts and share rides with real, authenticated humans, solving the fundamental trust problem in peer-to-peer travel platforms.

## Problem Statement

### Current Pain Points
1. **Trust Crisis:** 68% of users report safety concerns on existing platforms due to fake profiles and unverified users
2. **Fragmented Experience:** Travelers use multiple apps (accommodation + transportation) creating friction
3. **Verification Theater:** Current platforms have weak verification that doesn't inspire confidence
4. **Review Manipulation:** Fake reviews and bought ratings undermine platform integrity

### Target Users
- **Primary:** Digital nomads and backpackers (18-35) seeking authentic, affordable travel
- **Secondary:** Local hosts wanting to earn income and share culture
- **Tertiary:** Long-distance commuters needing reliable rideshare partners

## Solution Overview

### Core Value Proposition
"The first travel community where every host and driver is a cryptographically verified human"

### Key Differentiators
1. World ID proof-of-humanity ensures real users only
2. zkPDF verification for government documents without exposing personal data
3. Combined hosting + ridesharing in single platform
4. Non-transferable reputation tokens prevent gaming
5. Smart contract escrow for secure payments

## MVP Scope (36 Hours)

### In Scope - Must Have

#### User Authentication
- [ ] World ID integration via IDKit
- [ ] Basic user profile creation
- [ ] Email/phone verification
- [ ] Profile photo upload

#### Host Features
- [ ] Create property listing (title, description, photos, price)
- [ ] Set availability calendar
- [ ] View booking requests
- [ ] Accept/decline bookings

#### Guest Features
- [ ] Search listings by location
- [ ] View host profiles and verification badges
- [ ] Book accommodation with dates
- [ ] Basic messaging with hosts

#### Rideshare Features
- [ ] Create ride offer (route, date, seats, price)
- [ ] Search available rides
- [ ] Request seat in ride
- [ ] Driver verification badge

#### Smart Contracts
- [ ] User registration contract
- [ ] Basic booking contract with escrow
- [ ] Simple reputation tracking

#### Core UI/UX
- [ ] Landing page with value prop
- [ ] Search interface with map
- [ ] Listing detail pages
- [ ] Booking flow
- [ ] User dashboard

### Out of Scope - Post Hackathon
- Advanced document verification with zkPDF
- Payment processing with Stripe
- Real-time messaging with Socket.io
- Review and rating system
- Dispute resolution
- Mobile app version
- Multi-language support
- Insurance integration

## Technical Requirements

### Frontend
```
Framework: React.js with Next.js
UI Library: Tailwind CSS
Web3: @worldcoin/minikit-js, @worldcoin/idkit
Maps: MapBox GL JS
State: React Context API
```

### Backend
```
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB Atlas (free tier)
File Storage: Cloudinary (for images)
```

### Blockchain
```
Network: World Chain Sepolia Testnet
Smart Contracts: Solidity 0.8.x
Development: Foundry
Deployment: Hardhat
```

### External APIs
```
World ID API (verification)
MapBox API (geocoding/maps)
SendGrid (email notifications)
```

## User Stories

### Critical Path (P0)
1. **As a user**, I can sign up using World ID so that my humanity is verified
2. **As a host**, I can create a listing so that guests can find my space
3. **As a guest**, I can search and book accommodations so that I have a place to stay
4. **As a driver**, I can offer rides so that I can share travel costs
5. **As a traveler**, I can book rides so that I can reach my destination

### Nice to Have (P1)
6. **As a user**, I can message other users so that I can coordinate details
7. **As a user**, I can see verification badges so that I know who to trust
8. **As a host**, I can manage my calendar so that I control availability

## Data Models

### User Schema
```javascript
{
  worldId: String (unique),
  email: String,
  phone: String,
  profile: {
    name: String,
    bio: String,
    photo: String,
    location: String,
    languages: [String],
    verificationLevel: Enum['device', 'orb', 'orb+']
  },
  createdAt: Date,
  isHost: Boolean,
  isDriver: Boolean
}
```

### Listing Schema
```javascript
{
  hostId: ObjectId,
  type: Enum['couch', 'private_room', 'entire_place'],
  title: String,
  description: String,
  photos: [String],
  location: {
    address: String,
    coordinates: [Number, Number]
  },
  price: Number,
  availability: [{
    date: Date,
    available: Boolean
  }],
  amenities: [String]
}
```

### Booking Schema
```javascript
{
  guestId: ObjectId,
  listingId: ObjectId,
  checkIn: Date,
  checkOut: Date,
  status: Enum['pending', 'accepted', 'declined', 'completed'],
  totalPrice: Number,
  transactionHash: String
}
```

## Success Metrics

### Hackathon Demo Metrics
- Successfully onboard 5+ test users with World ID
- Create 10+ property listings
- Complete 3+ end-to-end booking flows
- Deploy smart contracts to testnet
- Process 1+ ride sharing match

### Judge Evaluation Criteria
- **Innovation:** Novel use of World ID and blockchain for trust
- **Technical Implementation:** Working MVP with smart contracts
- **User Experience:** Intuitive flow from sign-up to booking
- **Market Potential:** Clear value proposition and user need
- **Presentation:** Compelling demo and pitch

## Development Timeline

### Hour 0-6: Foundation
- Environment setup and project scaffolding
- World ID integration
- Basic authentication flow
- Database models

### Hour 6-12: Core Features
- Listing creation and management
- Search functionality
- Basic UI components
- Smart contract development

### Hour 12-18: Booking System
- Booking flow implementation
- Calendar functionality
- Smart contract deployment
- Initial testing

### Hour 18-24: Rideshare Features
- Ride offer creation
- Ride search and matching
- Driver verification display
- Integration testing

### Hour 24-30: Polish
- UI/UX improvements
- Bug fixes
- Add sample data
- Performance optimization

### Hour 30-36: Demo Prep
- End-to-end testing
- Demo script creation
- Presentation slides
- Video recording (backup)
- Final deployment

## Risk Mitigation

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| World ID integration issues | Medium | High | Test early, have mock data fallback |
| Smart contract bugs | High | High | Use simple contracts, audit templates |
| Time constraints | High | Medium | Focus on core features, cut scope aggressively |
| MapBox API limits | Low | Medium | Cache results, minimize API calls |

### Demo Risks
- **Internet failure:** Record video demo as backup
- **Transaction delays:** Pre-deploy contracts, use test data
- **Login issues:** Have pre-authenticated test accounts

## Definition of Done

### MVP Completion Checklist
- [ ] User can sign up with World ID
- [ ] User can create and edit profile
- [ ] Host can create property listing
- [ ] Guest can search listings by location
- [ ] Guest can book accommodation
- [ ] Driver can create ride offer
- [ ] Traveler can request ride
- [ ] Smart contracts deployed and verified
- [ ] Demo script tested end-to-end
- [ ] Presentation deck completed
- [ ] Code pushed to GitHub
- [ ] Live demo URL working

## Resources

### Documentation
- [World Documentation](https://docs.world.org)
- [MiniKit SDK Guide](https://docs.world.org/mini-apps)
- [IDKit Integration](https://docs.world.org/world-id)

### Support
- Discord: [World Developers](https://world.org/discord)
- Team Slack: [Your Slack]
- Emergency Contact: [Team Lead Phone]

## Appendix

### Quick Commands
```bash
# Start development
npm run dev

# Deploy contracts
forge script Deploy --rpc-url $RPC_URL

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
```
NEXT_PUBLIC_APP_ID=app_[your_world_app_id]
NEXT_PUBLIC_ACTION_ID=action_[your_action_id]
MONGODB_URI=[your_mongodb_connection]
MAPBOX_TOKEN=[your_mapbox_token]
```

---

**Remember:** Focus on demonstrating the core value proposition - verified humans making travel safer. Everything else is secondary. Ship fast, demo well, and show the future of trusted travel.