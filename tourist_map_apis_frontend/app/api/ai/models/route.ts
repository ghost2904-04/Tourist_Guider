// API 9: Get available AI models and their status
import { type NextRequest, NextResponse } from "next/server"
import { HUGGINGFACE_MODELS } from "@/lib/huggingface-models"
import type { APIResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const task = searchParams.get("task")
    const active = searchParams.get("active")

    let models = HUGGINGFACE_MODELS

    // Filter by task if specified
    if (task) {
      models = models.filter((model) => model.task === task)
    }

    // Filter by active status if specified
    if (active !== null) {
      models = models.filter((model) => model.isActive === (active === "true"))
    }

    // Group models by task
    const modelsByTask = models.reduce(
      (acc, model) => {
        if (!acc[model.task]) {
          acc[model.task] = []
        }
        acc[model.task].push(model)
        return acc
      },
      {} as Record<string, typeof HUGGINGFACE_MODELS>,
    )

    const apiResponse: APIResponse = {
      success: true,
      data: {
        models,
        modelsByTask,
        totalModels: models.length,
        activeModels: models.filter((m) => m.isActive).length,
        availableTasks: Object.keys(modelsByTask),
      },
      message: "AI models retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
