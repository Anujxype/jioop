import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the mongodb module
vi.mock("mongodb", () => {
  const connectMock = vi.fn().mockResolvedValue({});
  const MongoClientMock = vi.fn().mockImplementation(() => ({
    connect: connectMock,
  }));
  return { MongoClient: MongoClientMock };
});

describe("mongodb", () => {
  beforeEach(() => {
    vi.resetModules();
    delete (global as any)._mongoClientPromise;
  });

  it("should throw if MONGODB_URI is not set", async () => {
    const originalEnv = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;

    await expect(async () => {
      await import("@/lib/mongodb");
    }).rejects.toThrow('Invalid/Missing environment variable: "MONGODB_URI"');

    process.env.MONGODB_URI = originalEnv;
  });

  it("should export a clientPromise when MONGODB_URI is set", async () => {
    process.env.MONGODB_URI = "mongodb+srv://test:test@cluster.mongodb.net/";
    process.env.NODE_ENV = "test";

    const mod = await import("@/lib/mongodb");
    expect(mod.default).toBeDefined();
    expect(mod.default).toBeInstanceOf(Promise);
  });

  it("should reuse global client in development mode", async () => {
    process.env.MONGODB_URI = "mongodb+srv://test:test@cluster.mongodb.net/";
    process.env.NODE_ENV = "development";

    const mod1 = await import("@/lib/mongodb");
    const promise1 = mod1.default;

    expect(promise1).toBeDefined();
    expect((global as any)._mongoClientPromise).toBeDefined();
  });
});
