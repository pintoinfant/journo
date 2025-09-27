// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract JournoEscrow {
    struct Booking {
        address guest;
        address host;
        uint256 amount;
        uint256 checkIn;
        uint256 checkOut;
        bool isActive;
        bool isCompleted;
        bool isDisputed;
    }

    struct Ride {
        address driver;
        address[] passengers;
        uint256 amount;
        uint256 departureTime;
        bool isActive;
        bool isCompleted;
        bool isDisputed;
    }

    mapping(bytes32 => Booking) public bookings;
    mapping(bytes32 => Ride) public rides;
    
    address public owner;
    uint256 public platformFee = 5; // 5% platform fee
    
    event BookingCreated(bytes32 indexed bookingId, address indexed guest, address indexed host, uint256 amount);
    event BookingCompleted(bytes32 indexed bookingId);
    event BookingDisputed(bytes32 indexed bookingId);
    
    event RideCreated(bytes32 indexed rideId, address indexed driver, uint256 amount);
    event RideCompleted(bytes32 indexed rideId);
    event RideDisputed(bytes32 indexed rideId);

    constructor() {
        owner = msg.sender;
    }

    function createBooking(
        bytes32 bookingId,
        address host,
        uint256 checkIn,
        uint256 checkOut
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(bookings[bookingId].guest == address(0), "Booking already exists");
        
        bookings[bookingId] = Booking({
            guest: msg.sender,
            host: host,
            amount: msg.value,
            checkIn: checkIn,
            checkOut: checkOut,
            isActive: true,
            isCompleted: false,
            isDisputed: false
        });
        
        emit BookingCreated(bookingId, msg.sender, host, msg.value);
    }

    function createRide(
        bytes32 rideId,
        uint256 departureTime
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(rides[rideId].driver == address(0), "Ride already exists");
        
        rides[rideId] = Ride({
            driver: msg.sender,
            passengers: new address[](0),
            amount: msg.value,
            departureTime: departureTime,
            isActive: true,
            isCompleted: false,
            isDisputed: false
        });
        
        emit RideCreated(rideId, msg.sender, msg.value);
    }

    function completeBooking(bytes32 bookingId) external {
        Booking storage booking = bookings[bookingId];
        require(booking.isActive, "Booking not active");
        require(msg.sender == booking.host || msg.sender == owner, "Not authorized");
        
        booking.isActive = false;
        booking.isCompleted = true;
        
        uint256 platformFeeAmount = (booking.amount * platformFee) / 100;
        uint256 hostAmount = booking.amount - platformFeeAmount;
        
        payable(booking.host).transfer(hostAmount);
        payable(owner).transfer(platformFeeAmount);
        
        emit BookingCompleted(bookingId);
    }

    function completeRide(bytes32 rideId) external {
        Ride storage ride = rides[rideId];
        require(ride.isActive, "Ride not active");
        require(msg.sender == ride.driver || msg.sender == owner, "Not authorized");
        
        ride.isActive = false;
        ride.isCompleted = true;
        
        uint256 platformFeeAmount = (ride.amount * platformFee) / 100;
        uint256 driverAmount = ride.amount - platformFeeAmount;
        
        payable(ride.driver).transfer(driverAmount);
        payable(owner).transfer(platformFeeAmount);
        
        emit RideCompleted(rideId);
    }

    function disputeBooking(bytes32 bookingId) external {
        Booking storage booking = bookings[bookingId];
        require(booking.isActive, "Booking not active");
        require(msg.sender == booking.guest || msg.sender == booking.host, "Not authorized");
        
        booking.isDisputed = true;
        emit BookingDisputed(bookingId);
    }

    function disputeRide(bytes32 rideId) external {
        Ride storage ride = rides[rideId];
        require(ride.isActive, "Ride not active");
        require(msg.sender == ride.driver, "Not authorized");
        
        ride.isDisputed = true;
        emit RideDisputed(rideId);
    }

    function resolveDispute(bytes32 bookingId, bool refundGuest) external {
        require(msg.sender == owner, "Only owner can resolve disputes");
        
        Booking storage booking = bookings[bookingId];
        require(booking.isDisputed, "No dispute to resolve");
        
        booking.isActive = false;
        booking.isCompleted = true;
        
        if (refundGuest) {
            payable(booking.guest).transfer(booking.amount);
        } else {
            uint256 platformFeeAmount = (booking.amount * platformFee) / 100;
            uint256 hostAmount = booking.amount - platformFeeAmount;
            
            payable(booking.host).transfer(hostAmount);
            payable(owner).transfer(platformFeeAmount);
        }
    }

    function getBooking(bytes32 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }

    function getRide(bytes32 rideId) external view returns (Ride memory) {
        return rides[rideId];
    }
}
