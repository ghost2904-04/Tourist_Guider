// API 13: Analytics and insights
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getDestinations, getFacilities, getQueryHistory, getUsers } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "30d" // 7d, 30d, 90d, 1y
    const type = searchParams.get("type") || "overview" // overview, destinations, facilities, users

    await dbConnection.connect()

    // Calculate date range
    const now = new Date()
    const daysBack = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    const analytics: any = {}

    if (type === "overview" || type === "all") {
      // Overall platform statistics
      const [totalDestinations, totalFacilities, totalUsers, recentQueries] = await Promise.all([
        getDestinations().countDocuments(),
        getFacilities().countDocuments(),
        getUsers().countDocuments(),
        getQueryHistory().countDocuments({ timestamp: { $gte: startDate } }),
      ])

      analytics.overview = {
        totalDestinations,
        totalFacilities,
        totalUsers,
        recentQueries,
        timeframe,
      }
    }

    if (type === "destinations" || type === "all") {
      // Destination analytics
      const destinations = getDestinations()

      const [destinationsByRegion, destinationsBySafety, topDestinations] = await Promise.all([
        destinations.aggregate([{ $group: { _id: "$region", count: { $sum: 1 } } }]).toArray(),
        destinations.aggregate([{ $group: { _id: "$safetyGradient", count: { $sum: 1 } } }]).toArray(),
        destinations.find().sort({ safetyScore: -1 }).limit(10).toArray(),
      ])

      analytics.destinations = {
        byRegion: destinationsByRegion,
        bySafety: destinationsBySafety,
        topRated: topDestinations,
      }
    }

    if (type === "facilities" || type === "all") {
      // Facility analytics
      const facilities = getFacilities()

      const [facilitiesByType, verificationStats, topRatedFacilities] = await Promise.all([
        facilities.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]).toArray(),
        facilities.aggregate([{ $group: { _id: "$verified", count: { $sum: 1 } } }]).toArray(),
        facilities.find({ verified: true }).sort({ rating: -1 }).limit(10).toArray(),
      ])

      analytics.facilities = {
        byType: facilitiesByType,
        verification: verificationStats,
        topRated: topRatedFacilities,
      }
    }

    if (type === "users" || type === "all") {
      // User analytics
      const users = getUsers()
      const queries = getQueryHistory()

      const [usersByRegion, activeUsers, popularQueries] = await Promise.all([
        users
          .aggregate([
            { $unwind: "$preferences.regions" },
            { $group: { _id: "$preferences.regions", count: { $sum: 1 } } },
          ])
          .toArray(),
        queries
          .aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            { $group: { _id: "$userId", queryCount: { $sum: 1 } } },
            { $sort: { queryCount: -1 } },
            { $limit: 10 },
          ])
          .toArray(),
        queries
          .aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            { $group: { _id: "$query", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ])
          .toArray(),
      ])

      analytics.users = {
        byRegion: usersByRegion,
        mostActive: activeUsers,
        popularQueries,
      }
    }

    const apiResponse: APIResponse = {
      success: true,
      data: analytics,
      message: "Analytics retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
