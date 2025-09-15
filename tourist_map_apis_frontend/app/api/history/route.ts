// API 5: Show user queries and responses
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getQueryHistory } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!userId) {
      return NextResponse.json({ success: false, error: "UserId is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const history = getQueryHistory()

    const queries = await history.find({ userId }).sort({ timestamp: -1 }).skip(offset).limit(limit).toArray()

    const total = await history.countDocuments({ userId })

    const apiResponse: APIResponse = {
      success: true,
      data: {
        queries,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      message: "Query history retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching query history:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
