// API 3: Update traveler requirements/preferences
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getUsers } from "@/lib/database"
import type { APIResponse, UserPreferences } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, preferences } = body

    if (!userId || !preferences) {
      return NextResponse.json({ success: false, error: "UserId and preferences are required" }, { status: 400 })
    }

    await dbConnection.connect()
    const users = getUsers()

    const updatedPreferences: UserPreferences = {
      regions: preferences.regions || [],
      safetyLevel: preferences.safetyLevel || "medium",
      accessibility: preferences.accessibility || false,
      budget: preferences.budget || "medium",
      interests: preferences.interests || [],
      language: preferences.language || "en",
    }

    const result = await users.updateOne(
      { _id: userId },
      {
        $set: {
          preferences: updatedPreferences,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    const apiResponse: APIResponse = {
      success: true,
      data: {
        userId,
        preferences: updatedPreferences,
        updated: result.modifiedCount > 0 || result.upsertedCount > 0,
      },
      message: "Preferences updated successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "UserId is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const users = getUsers()

    const user = await users.findOne({ _id: userId })

    const apiResponse: APIResponse = {
      success: true,
      data: user?.preferences || null,
      message: "Preferences retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
