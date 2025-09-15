// API Documentation Page
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Brain, Shield, Map, Users, BarChart3, Wallet, LinkIcon } from "lucide-react"
import Link from "next/link"

const API_ENDPOINTS = [
  {
    id: 1,
    method: "POST",
    path: "/api/process",
    title: "Process Queries & Recommendations",
    description: "Process user queries, provide AI-powered recommendations, and handle facility data submissions",
    category: "AI Processing",
    icon: Brain,
    parameters: ["query", "userId", "type", "preferences", "location"],
    responses: ["recommendations", "facility_submission", "safety_query", "general"],
  },
  {
    id: 2,
    method: "GET",
    path: "/api/map",
    title: "Map Data & Safety Metrics",
    description: "Fetch destination map data, safety overlays, and facility markers with real-time status",
    category: "Map Services",
    icon: Map,
    parameters: ["region", "safetyLevel", "facilityType", "bounds"],
    responses: ["destinations", "safetyOverlay", "facilityMarkers", "bounds"],
  },
  {
    id: 3,
    method: "POST/GET",
    path: "/api/preferences",
    title: "User Preferences Management",
    description: "Update and retrieve traveler requirements, safety preferences, and accessibility needs",
    category: "User Management",
    icon: Users,
    parameters: ["userId", "preferences", "regions", "safetyLevel", "accessibility"],
    responses: ["preferences", "updated", "userId"],
  },
  {
    id: 4,
    method: "GET",
    path: "/api/verify/[hash]",
    title: "Blockchain Proof Verification",
    description: "Check blockchain proof validity for facility verifications and safety incidents",
    category: "Blockchain",
    icon: Shield,
    parameters: ["hash"],
    responses: ["proof", "blockchain", "verified", "verificationTime"],
  },
  {
    id: 5,
    method: "GET",
    path: "/api/history",
    title: "Query History",
    description: "Retrieve user query history with responses and model information",
    category: "User Management",
    icon: Database,
    parameters: ["userId", "limit", "offset"],
    responses: ["queries", "pagination", "total", "hasMore"],
  },
  {
    id: 6,
    method: "POST",
    path: "/api/webhook/model-callback",
    title: "AI Model Callbacks",
    description: "Handle async AI model results for facility verification and safety assessments",
    category: "AI Processing",
    icon: Brain,
    parameters: ["modelId", "facilityId", "result", "txHash", "proofType"],
    responses: ["processed", "result", "modelId"],
  },
  {
    id: 7,
    method: "GET/POST",
    path: "/api/destinations",
    title: "Destinations CRUD",
    description: "Create, read, update, and delete destination information with AI-enhanced tagging",
    category: "Data Management",
    icon: Map,
    parameters: ["search", "region", "safetyLevel", "name", "geoCoords", "facilities"],
    responses: ["destinations", "pagination", "destinationId", "aiTags"],
  },
  {
    id: 8,
    method: "GET/POST",
    path: "/api/facilities",
    title: "Facilities CRUD",
    description: "Manage facility information including hospitals, ATMs, restaurants, and transport",
    category: "Data Management",
    icon: Database,
    parameters: ["destinationId", "type", "verified", "name", "coordinates"],
    responses: ["facilities", "facilityId", "facility"],
  },
  {
    id: 9,
    method: "GET",
    path: "/api/ai/models",
    title: "AI Models Status",
    description: "Get available Hugging Face models, their status, and capabilities by task type",
    category: "AI Processing",
    icon: Brain,
    parameters: ["task", "active"],
    responses: ["models", "modelsByTask", "totalModels", "activeModels", "availableTasks"],
  },
  {
    id: 10,
    method: "POST",
    path: "/api/ai/generate",
    title: "AI Content Generation",
    description: "Generate content using various AI models for text, classification, translation, and more",
    category: "AI Processing",
    icon: Brain,
    parameters: ["task", "input", "modelId", "parameters"],
    responses: ["result", "task", "modelId", "processingTime"],
  },
  {
    id: 11,
    method: "POST",
    path: "/api/search",
    title: "Semantic Search",
    description: "Perform semantic search across destinations and facilities using AI embeddings",
    category: "Search",
    icon: Brain,
    parameters: ["query", "type", "limit", "filters"],
    responses: ["results", "queryEmbeddings", "classification", "totalResults"],
  },
  {
    id: 12,
    method: "GET/POST",
    path: "/api/reviews",
    title: "Reviews & Ratings",
    description: "Manage facility reviews with AI-powered sentiment analysis and rating aggregation",
    category: "Data Management",
    icon: Database,
    parameters: ["facilityId", "userId", "rating", "comment"],
    responses: ["reviews", "sentimentAnalysis", "newAverageRating"],
  },
  {
    id: 13,
    method: "GET",
    path: "/api/analytics",
    title: "Platform Analytics",
    description: "Comprehensive analytics and insights for destinations, facilities, and user behavior",
    category: "Analytics",
    icon: BarChart3,
    parameters: ["timeframe", "type"],
    responses: ["overview", "destinations", "facilities", "users"],
  },
  {
    id: 14,
    method: "GET/POST",
    path: "/api/wallet",
    title: "MetaMask Wallet Operations",
    description: "Handle wallet connections, verifications, transactions, and user wallet management",
    category: "Blockchain",
    icon: Wallet,
    parameters: ["action", "userId", "walletAddress", "signature", "transactionHash"],
    responses: ["connected", "verified", "transactions", "user"],
  },
  {
    id: 15,
    method: "GET/POST",
    path: "/api/blockchain",
    title: "Blockchain Verification System",
    description: "Create, verify, and manage blockchain proofs for facility data and safety incidents",
    category: "Blockchain",
    icon: Shield,
    parameters: ["action", "facilityId", "proofType", "proofHash", "data"],
    responses: ["proofHash", "txHash", "verified", "proofs", "statistics"],
  },
]

const CATEGORIES = {
  "AI Processing": { color: "bg-blue-500", count: 4 },
  "Map Services": { color: "bg-green-500", count: 2 },
  "User Management": { color: "bg-purple-500", count: 2 },
  Blockchain: { color: "bg-orange-500", count: 3 },
  "Data Management": { color: "bg-cyan-500", count: 3 },
  Search: { color: "bg-pink-500", count: 1 },
  Analytics: { color: "bg-indigo-500", count: 1 },
}

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
              <p className="text-muted-foreground mt-2">Complete reference for TourismMap India's 15 API endpoints</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <LinkIcon className="h-4 w-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Endpoints</p>
                  <p className="text-2xl font-bold text-foreground">15</p>
                </div>
                <Code className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Models</p>
                  <p className="text-2xl font-bold text-foreground">15</p>
                </div>
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">7</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blockchain Enabled</p>
                  <p className="text-2xl font-bold text-foreground">Yes</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Categories</CardTitle>
            <CardDescription>Our APIs are organized into 7 main categories for easy navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(CATEGORIES).map(([category, info]) => (
                <div key={category} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-3 h-3 rounded-full ${info.color}`} />
                  <div>
                    <p className="font-medium text-sm">{category}</p>
                    <p className="text-xs text-muted-foreground">{info.count} endpoints</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {API_ENDPOINTS.map((endpoint) => {
                const IconComponent = endpoint.icon
                return (
                  <Card key={endpoint.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{endpoint.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {endpoint.method}
                              </Badge>
                              <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          #{endpoint.id}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Parameters</h4>
                          <div className="flex flex-wrap gap-1">
                            {endpoint.parameters.map((param) => (
                              <Badge key={param} variant="outline" className="text-xs">
                                {param}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Response Fields</h4>
                          <div className="flex flex-wrap gap-1">
                            {endpoint.responses.map((response) => (
                              <Badge key={response} variant="secondary" className="text-xs">
                                {response}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Category-specific tabs */}
          {Object.keys(CATEGORIES).map((category) => (
            <TabsContent
              key={category.toLowerCase()}
              value={category.toLowerCase().split(" ")[0]}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {API_ENDPOINTS.filter((endpoint) => endpoint.category === category).map((endpoint) => {
                  const IconComponent = endpoint.icon
                  return (
                    <Card key={endpoint.id} className="bg-card border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{endpoint.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {endpoint.method}
                                </Badge>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            #{endpoint.id}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{endpoint.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Parameters</h4>
                            <div className="flex flex-wrap gap-1">
                              {endpoint.parameters.map((param) => (
                                <Badge key={param} variant="outline" className="text-xs">
                                  {param}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Response Fields</h4>
                            <div className="flex flex-wrap gap-1">
                              {endpoint.responses.map((response) => (
                                <Badge key={response} variant="secondary" className="text-xs">
                                  {response}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
