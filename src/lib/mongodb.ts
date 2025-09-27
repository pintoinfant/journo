// lib/mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || "";

// MongoDB connection options with SSL configuration
const mongoOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // SSL/TLS options to fix the SSL handshake error
  tls: true,
  ssl: true,
  family: 4,

  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  // Connection timeout and retry settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  // Retry writes for better reliability
  retryWrites: true,
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, mongoOptions);
  clientPromise = client.connect();
}

export default clientPromise;
