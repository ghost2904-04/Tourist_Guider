// API 10: Generate content using AI models
import { type NextRequest, NextResponse } from "next/server"
import { huggingFaceService } from "@/lib/huggingface-models"
import type { APIResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task, input, modelId, parameters } = body

    if (!task || !input) {
      return NextResponse.json({ success: false, error: "Task and input are required" }, { status: 400 })
    }

    let result: any

    switch (task) {
      case "text-generation":
        result = await huggingFaceService.generateText(input, modelId)
        break

      case "feature-extraction":
        result = await huggingFaceService.getEmbeddings(input, modelId)
        break

      case "text-classification":
        const labels = parameters?.labels || ["positive", "negative", "neutral"]
        result = await huggingFaceService.classifyText(input, labels, modelId)
        break

      case "sentiment-analysis":
        result = await huggingFaceService.analyzeSentiment(input, modelId)
        break

      case "question-answering":
        if (!parameters?.context) {
          return NextResponse.json(
            { success: false, error: "Context is required for question answering" },
            { status: 400 },
          )
        }
        result = await huggingFaceService.answerQuestion(input, parameters.context, modelId)
        break

      case "summarization":
        result = await huggingFaceService.summarizeText(input, modelId)
        break

      case "translation":
        result = await huggingFaceService.translateText(input, modelId)
        break

      case "token-classification":
        result = await huggingFaceService.extractEntities(input, modelId)
        break

      case "image-classification":
        result = await huggingFaceService.classifyImage(input, modelId)
        break

      case "object-detection":
        result = await huggingFaceService.detectObjects(input, modelId)
        break

      default:
        return NextResponse.json({ success: false, error: `Unsupported task: ${task}` }, { status: 400 })
    }

    const apiResponse: APIResponse = {
      success: true,
      data: {
        task,
        input,
        modelId: modelId || "default",
        result,
        processingTime: new Date(),
      },
      message: "AI generation completed successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error in AI generation:", error)
    return NextResponse.json({ success: false, error: "AI generation failed" }, { status: 500 })
  }
}
