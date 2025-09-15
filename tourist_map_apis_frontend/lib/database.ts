// Database connection and utilities
import { MongoClient, type Db, type Collection } from "mongodb"

class DatabaseConnection {
  private static instance: DatabaseConnection
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async connect(): Promise<Db> {
    if (this.db) {
      return this.db
    }

    try {
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
      this.client = new MongoClient(uri)
      await this.client.connect()
      this.db = this.client.db("tourism_platform")

      console.log("Connected to MongoDB")
      return this.db
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }

  public getCollection<T = any>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error("Database not connected")
    }
    return this.db.collection<T>(name)
  }
}

export const dbConnection = DatabaseConnection.getInstance()

// Collection helpers
export const getUsers = () => dbConnection.getCollection("users")
export const getDestinations = () => dbConnection.getCollection("destinations")
export const getFacilities = () => dbConnection.getCollection("facilities")
export const getQueryHistory = () => dbConnection.getCollection("query_history")
export const getBlockchainProofs = () => dbConnection.getCollection("blockchain_proofs")
