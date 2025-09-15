"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  Users,
  MapPin,
  Shield,
  Brain,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockAnalytics = {
  overview: {
    totalDestinations: 1247,
    totalFacilities: 8934,
    totalUsers: 15678,
    recentQueries: 2341,
    timeframe: "30d",
  },
  destinations: {
    byRegion: [
      { _id: "Northern India", count: 312 },
      { _id: "Western India", count: 298 },
      { _id: "Southern India", count: 267 },
      { _id: "Eastern India", count: 234 },
      { _id: "Central India", count: 136 },
    ],
    bySafety: [
      { _id: "high", count: 623 },
      { _id: "medium", count: 456 },
      { _id: "low", count: 168 },
    ],
    topRated: [
      { name: "Goa Beach Resort", safetyScore: 9.2, state: "Goa" },
      { name: "Kerala Backwaters", safetyScore: 9.1, state: "Kerala" },
      { name: "Rajasthan Palace", safetyScore: 8.9, state: "Rajasthan" },
    ],
  },
  facilities: {
    byType: [
      { _id: "restaurant", count: 2341 },
      { _id: "hotel", count: 1876 },
      { _id: "hospital", count: 1234 },
      { _id: "atm", count: 987 },
      { _id: "transport", count: 876 },
      { _id: "wifi", count: 654 },
    ],
    verification: [
      { _id: true, count: 6789 },
      { _id: false, count: 2145 },
    ],
  },
  users: {
    byRegion: [
      { _id: "Northern India", count: 4567 },
      { _id: "Western India", count: 3456 },
      { _id: "Southern India", count: 3234 },
      { _id: "Eastern India", count: 2876 },
      { _id: "Central India", count: 1545 },
    ],
    mostActive: [
      { _id: "user123", queryCount: 45 },
      { _id: "user456", queryCount: 38 },
      { _id: "user789", queryCount: 32 },
    ],
    popularQueries: [
      { _id: "safe places in goa", count: 234 },
      { _id: "best hospitals in delhi", count: 187 },
      { _id: "family friendly resorts", count: 156 },
    ],
  },
}

const mockAIModels = {
  totalModels: 15,
  activeModels: 15,
  modelsByTask: {
    "text-generation": 2,
    "feature-extraction": 2,
    "text-classification": 2,
    "question-answering": 1,
    summarization: 1,
    translation: 1,
    "image-classification": 1,
    "token-classification": 1,
    "text-to-speech": 1,
    "object-detection": 1,
    conversational: 1,
    "fill-mask": 1,
  },
}

const mockBlockchainStats = {
  totalProofs: 3456,
  verifiedProofs: 3123,
  pendingProofs: 333,
  proofTypes: {
    verification: 2134,
    incident: 876,
    review: 446,
  },
}

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("30d")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive analytics and management for TourismMap India
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Link href="/">
                <Button variant="outline">Back to Platform</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Destinations</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockAnalytics.overview.totalDestinations.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Facilities</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockAnalytics.overview.totalFacilities.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockAnalytics.overview.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Queries</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockAnalytics.overview.recentQueries.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23% from last month
                  </p>
                </div>
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="ai">AI Models</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Destinations by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.destinations.byRegion.map((region) => (
                      <div key={region._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region._id}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(region.count / 312) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{region.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Level Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.destinations.bySafety.map((safety) => {
                      const color =
                        safety._id === "high"
                          ? "bg-green-500"
                          : safety._id === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      const icon = safety._id === "high" ? CheckCircle : safety._id === "medium" ? Clock : AlertTriangle
                      const IconComponent = icon

                      return (
                        <div key={safety._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium capitalize">{safety._id} Safety</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className={`${color} h-2 rounded-full`}
                                style={{ width: `${(safety.count / 623) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">{safety.count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* AI Models Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Models Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{mockAIModels.totalModels}</p>
                      <p className="text-sm text-muted-foreground">Total Models</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{mockAIModels.activeModels}</p>
                      <p className="text-sm text-muted-foreground">Active Models</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {Object.entries(mockAIModels.modelsByTask)
                      .slice(0, 5)
                      .map(([task, count]) => (
                        <div key={task} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{task.replace("-", " ")}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{mockBlockchainStats.totalProofs}</p>
                      <p className="text-xs text-muted-foreground">Total Proofs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{mockBlockchainStats.verifiedProofs}</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600">{mockBlockchainStats.pendingProofs}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(mockBlockchainStats.proofTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{type}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Destination Management</h3>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top Rated Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.destinations.topRated.map((dest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{dest.name}</h4>
                          <p className="text-sm text-muted-foreground">{dest.state}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{dest.safetyScore}/10</Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    Add New Destination
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Bulk Import
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Safety Assessment
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Facility Management</h3>
              <div className="flex items-center space-x-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="restaurant">Restaurants</SelectItem>
                    <SelectItem value="hotel">Hotels</SelectItem>
                    <SelectItem value="hospital">Hospitals</SelectItem>
                    <SelectItem value="atm">ATMs</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Facilities by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.facilities.byType.map((facility) => (
                      <div key={facility._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{facility._id}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(facility.count / 2341) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {facility.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "76%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {mockAnalytics.facilities.verification[0].count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "24%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {mockAnalytics.facilities.verification[1].count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Users by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.users.byRegion.map((region) => (
                      <div key={region._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region._id}</span>
                        <Badge variant="outline">{region.count.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.users.mostActive.map((user, index) => (
                      <div key={user._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="text-sm font-medium">{user._id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{user.queryCount} queries</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.users.popularQueries.map((query) => (
                      <div key={query._id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{query._id}</span>
                          <Badge variant="secondary">{query.count}</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${(query.count / 234) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockAIModels.modelsByTask).map(([task, count]) => (
                      <div key={task} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{task.replace("-", " ")}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count} models</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">2,341</p>
                      <p className="text-sm text-muted-foreground">Total AI Queries Today</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">98.7%</p>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">1.2s</p>
                        <p className="text-xs text-muted-foreground">Avg Response</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {mockBlockchainStats.totalProofs.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Blockchain Proofs</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">
                          {mockBlockchainStats.verifiedProofs.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Verified</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-yellow-600">{mockBlockchainStats.pendingProofs}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proof Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(mockBlockchainStats.proofTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(count / 2134) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
