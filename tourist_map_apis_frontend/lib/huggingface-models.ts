// Comprehensive Hugging Face models integration
export const HUGGINGFACE_MODELS = [
  // Text Generation Models
  {
    id: "gpt2",
    name: "GPT-2",
    task: "text-generation",
    endpoint: "https://api-inference.huggingface.co/models/gpt2",
    pipeline_tag: "text-generation",
    library_name: "transformers",
    isActive: true,
    description: "General text generation for travel descriptions",
  },
  {
    id: "distilgpt2",
    name: "DistilGPT-2",
    task: "text-generation",
    endpoint: "https://api-inference.huggingface.co/models/distilgpt2",
    pipeline_tag: "text-generation",
    library_name: "transformers",
    isActive: true,
    description: "Lightweight text generation",
  },
  // Embedding Models
  {
    id: "sentence-transformers/all-MiniLM-L6-v2",
    name: "All-MiniLM-L6-v2",
    task: "feature-extraction",
    endpoint: "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    pipeline_tag: "sentence-similarity",
    library_name: "sentence-transformers",
    isActive: true,
    description: "Semantic search for destinations and facilities",
  },
  {
    id: "sentence-transformers/all-mpnet-base-v2",
    name: "All-MPNet-Base-v2",
    task: "feature-extraction",
    endpoint: "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2",
    pipeline_tag: "sentence-similarity",
    library_name: "sentence-transformers",
    isActive: true,
    description: "High-quality embeddings for travel recommendations",
  },
  // Classification Models
  {
    id: "cardiffnlp/twitter-roberta-base-sentiment-latest",
    name: "Twitter RoBERTa Sentiment",
    task: "text-classification",
    endpoint: "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
    pipeline_tag: "text-classification",
    library_name: "transformers",
    isActive: true,
    description: "Sentiment analysis for reviews and feedback",
  },
  {
    id: "facebook/bart-large-mnli",
    name: "BART Large MNLI",
    task: "zero-shot-classification",
    endpoint: "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    pipeline_tag: "zero-shot-classification",
    library_name: "transformers",
    isActive: true,
    description: "Classify travel queries and intents",
  },
  // Question Answering
  {
    id: "deepset/roberta-base-squad2",
    name: "RoBERTa Base SQuAD2",
    task: "question-answering",
    endpoint: "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
    pipeline_tag: "question-answering",
    library_name: "transformers",
    isActive: true,
    description: "Answer questions about destinations and facilities",
  },
  // Summarization
  {
    id: "facebook/bart-large-cnn",
    name: "BART Large CNN",
    task: "summarization",
    endpoint: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    pipeline_tag: "summarization",
    library_name: "transformers",
    isActive: true,
    description: "Summarize travel information and reviews",
  },
  // Translation
  {
    id: "Helsinki-NLP/opus-mt-en-hi",
    name: "English to Hindi Translation",
    task: "translation",
    endpoint: "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-hi",
    pipeline_tag: "translation",
    library_name: "transformers",
    isActive: true,
    description: "Translate content to Hindi for local users",
  },
  // Image Classification
  {
    id: "google/vit-base-patch16-224",
    name: "Vision Transformer",
    task: "image-classification",
    endpoint: "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
    pipeline_tag: "image-classification",
    library_name: "transformers",
    isActive: true,
    description: "Classify uploaded destination images",
  },
  // Named Entity Recognition
  {
    id: "dbmdz/bert-large-cased-finetuned-conll03-english",
    name: "BERT NER",
    task: "token-classification",
    endpoint: "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english",
    pipeline_tag: "token-classification",
    library_name: "transformers",
    isActive: true,
    description: "Extract location names and entities from text",
  },
  // Text-to-Speech
  {
    id: "microsoft/speecht5_tts",
    name: "SpeechT5 TTS",
    task: "text-to-speech",
    endpoint: "https://api-inference.huggingface.co/models/microsoft/speecht5_tts",
    pipeline_tag: "text-to-speech",
    library_name: "transformers",
    isActive: true,
    description: "Generate audio guides for destinations",
  },
  // Object Detection
  {
    id: "facebook/detr-resnet-50",
    name: "DETR ResNet-50",
    task: "object-detection",
    endpoint: "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    pipeline_tag: "object-detection",
    library_name: "transformers",
    isActive: true,
    description: "Detect objects in destination photos",
  },
  // Conversational AI
  {
    id: "microsoft/DialoGPT-medium",
    name: "DialoGPT Medium",
    task: "conversational",
    endpoint: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
    pipeline_tag: "conversational",
    library_name: "transformers",
    isActive: true,
    description: "Conversational travel assistant",
  },
  // Additional specialized models
  {
    id: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    name: "Multilingual Paraphrase",
    task: "feature-extraction",
    endpoint: "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    pipeline_tag: "sentence-similarity",
    library_name: "sentence-transformers",
    isActive: true,
    description: "Multilingual semantic search for Indian languages",
  },
  {
    id: "huggingface/CodeBERTa-small-v1",
    name: "CodeBERTa Small",
    task: "fill-mask",
    endpoint: "https://api-inference.huggingface.co/models/huggingface/CodeBERTa-small-v1",
    pipeline_tag: "fill-mask",
    library_name: "transformers",
    isActive: true,
    description: "Code completion for API integrations",
  },
]

export class HuggingFaceService {
  private apiKey: string
  private baseUrl = "https://api-inference.huggingface.co/models/"

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || ""
  }

  async queryModel(modelId: string, inputs: any, parameters?: any) {
    const model = HUGGINGFACE_MODELS.find((m) => m.id === modelId)
    if (!model || !model.isActive) {
      throw new Error(`Model ${modelId} not found or inactive`)
    }

    try {
      const response = await fetch(model.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs,
          parameters: parameters || {},
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error querying model ${modelId}:`, error)
      throw error
    }
  }

  async generateText(prompt: string, modelId = "gpt2") {
    return this.queryModel(modelId, prompt, {
      max_length: 200,
      temperature: 0.7,
      do_sample: true,
    })
  }

  async getEmbeddings(text: string, modelId = "sentence-transformers/all-MiniLM-L6-v2") {
    return this.queryModel(modelId, text)
  }

  async classifyText(text: string, labels: string[], modelId = "facebook/bart-large-mnli") {
    return this.queryModel(modelId, {
      inputs: text,
      parameters: { candidate_labels: labels },
    })
  }

  async analyzeSentiment(text: string, modelId = "cardiffnlp/twitter-roberta-base-sentiment-latest") {
    return this.queryModel(modelId, text)
  }

  async answerQuestion(question: string, context: string, modelId = "deepset/roberta-base-squad2") {
    return this.queryModel(modelId, {
      question,
      context,
    })
  }

  async summarizeText(text: string, modelId = "facebook/bart-large-cnn") {
    return this.queryModel(modelId, text, {
      max_length: 150,
      min_length: 30,
    })
  }

  async translateText(text: string, modelId = "Helsinki-NLP/opus-mt-en-hi") {
    return this.queryModel(modelId, text)
  }

  async classifyImage(imageUrl: string, modelId = "google/vit-base-patch16-224") {
    return this.queryModel(modelId, imageUrl)
  }

  async extractEntities(text: string, modelId = "dbmdz/bert-large-cased-finetuned-conll03-english") {
    return this.queryModel(modelId, text)
  }

  async detectObjects(imageUrl: string, modelId = "facebook/detr-resnet-50") {
    return this.queryModel(modelId, imageUrl)
  }

  getActiveModels() {
    return HUGGINGFACE_MODELS.filter((model) => model.isActive)
  }

  getModelsByTask(task: string) {
    return HUGGINGFACE_MODELS.filter((model) => model.task === task && model.isActive)
  }
}

export const huggingFaceService = new HuggingFaceService()
