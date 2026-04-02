const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set a test JWT secret so auth middleware can verify tokens
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "test-secret";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
