// Core data models for the tourism platform

export interface User {
  _id: string
  name: string
  email: string
  wallet?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  regions: string[]
  safetyLevel: "low" | "medium" | "high"
  accessibility: boolean
  budget: "low" | "medium" | "high"
  interests: string[]
  language: string
}

export interface Destination {
  _id: string
  name: string
  description: string
  geoCoords: {
    latitude: number
    longitude: number
  }
  region: string
  state: string
  safetyScore: number
  safetyGradient: "high" | "medium" | "low"
  facilities: Facility[]
  verifiedHashes: string[]
  images: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Facility {
  _id: string
  type: FacilityType
  name: string
  destinationId: string
  verified: boolean
  proofHash?: string
  status: "active" | "inactive" | "maintenance"
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  rating: number
  reviews: Review[]
  coordinates: {
    latitude: number
    longitude: number
  }
  timestamps: {
    createdAt: Date
    updatedAt: Date
    lastVerified?: Date
  }
}

export type FacilityType =
  | "hospital"
  | "atm"
  | "restaurant"
  | "hotel"
  | "transport"
  | "wifi"
  | "police"
  | "tourist_info"
  | "fuel_station"
  | "pharmacy"

export interface Review {
  _id: string
  userId: string
  rating: number
  comment: string
  verified: boolean
  createdAt: Date
}

export interface QueryHistory {
  _id: string
  userId: string
  query: string
  response: string
  modelId: string
  facility?: string
  txHash?: string
  timestamp: Date
}

export interface AIModel {
  id: string
  name: string
  provider: "huggingface" | "openai" | "anthropic"
  type: "text-generation" | "embedding" | "classification" | "sentiment"
  endpoint: string
  isActive: boolean
}

export interface MapData {
  destinations: Destination[]
  safetyOverlay: SafetyOverlay[]
  facilityMarkers: FacilityMarker[]
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface SafetyOverlay {
  coordinates: number[][]
  safetyLevel: "high" | "medium" | "low"
  color: string
  opacity: number
}

export interface FacilityMarker {
  id: string
  type: FacilityType
  coordinates: [number, number]
  name: string
  verified: boolean
  rating: number
}

export interface BlockchainProof {
  hash: string
  facilityId: string
  proofType: "verification" | "incident" | "review"
  timestamp: Date
  txHash: string
  verified: boolean
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface HuggingFaceModel {
  id: string
  name: string
  task: string
  endpoint: string
  pipeline_tag: string
  library_name: string
  isActive: boolean
}
