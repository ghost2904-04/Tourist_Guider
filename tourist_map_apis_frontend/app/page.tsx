"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Shield, Wifi, Hospital, Car, Coffee, BarChart3, Settings } from "lucide-react"
import { metaMaskService, type WalletState } from "@/lib/metamask"
import { HUGGINGFACE_MODELS } from "@/lib/huggingface-models"
import Link from "next/link"

export default function HomePage() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkWalletConnection()
    setupWalletListeners()

    return () => {
      metaMaskService.removeAllListeners()
    }
  }, [])

  const checkWalletConnection = async () => {
    try {
      const state = await metaMaskService.getWalletState()
      setWalletState(state)
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const setupWalletListeners = () => {
    metaMaskService.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setWalletState({
          isConnected: false,
          account: null,
          chainId: null,
          balance: null,
        })
      } else {
        checkWalletConnection()
      }
    })

    metaMaskService.onChainChanged(() => {
      checkWalletConnection()
    })
  }

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      const state = await metaMaskService.connectWallet()
      setWalletState(state)
      localStorage.setItem("wallet_connected", "true")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const activeModels = HUGGINGFACE_MODELS.filter((model) => model.isActive)
  const modelsByTask = activeModels.reduce(
    (acc, model) => {
      if (!acc[model.task]) {
        acc[model.task] = []
      }
      acc[model.task].push(model)
      return acc
    },
    {} as Record<string, typeof HUGGINGFACE_MODELS>,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">TourismMap India</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Travel Safety Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {walletState.isConnected ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    Connected
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {walletState.account?.slice(0, 6)}...{walletState.account?.slice(-4)}
                  </span>
                  <span className="text-sm font-medium">{walletState.balance} ETH</span>
                </div>
              ) : (
                <Button onClick={connectWallet} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}

              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Explore India Safely with AI-Powered Insights</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover destinations with real-time safety ratings, facility information, and blockchain-verified data.
            Powered by {activeModels.length} advanced AI models for personalized travel recommendations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Safety Ratings</span>
            </div>
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg">
              <Hospital className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Medical Facilities</span>
            </div>
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Transport Info</span>
            </div>
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg">
              <Wifi className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Connectivity</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/map">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Interactive Map
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline">
                View API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Models Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Powered by {activeModels.length} AI Models</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform integrates multiple Hugging Face models to provide comprehensive travel insights, from
              sentiment analysis of reviews to multilingual support and image recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(modelsByTask).map(([task, models]) => (
              <Card key={task} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg capitalize text-card-foreground">{task.replace("-", " ")}</CardTitle>
                  <CardDescription>
                    {models.length} model{models.length > 1 ? "s" : ""} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {models.slice(0, 3).map((model) => (
                      <div key={model.id} className="flex items-center justify-between">
                        <span className="text-sm text-card-foreground truncate">{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    ))}
                    {models.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{models.length - 3} more models</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Platform Features</h3>
            <p className="text-lg text-muted-foreground">
              Everything you need for safe and informed travel across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-card border-border">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg text-card-foreground">Safety Gradients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Real-time safety ratings with color-coded map overlays</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-border">
              <CardHeader>
                <Hospital className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg text-card-foreground">Facility Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Live status of hospitals, ATMs, restaurants, and more</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-border">
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg text-card-foreground">Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Facility data verified on blockchain for trust and transparency
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-border">
              <CardHeader>
                <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg text-card-foreground">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personalized travel suggestions powered by machine learning
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Platform Access</h3>
            <p className="text-lg text-muted-foreground">
              Explore different aspects of our comprehensive tourism platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/map">
              <Card className="text-center bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg text-card-foreground">Interactive Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore destinations with safety gradients and facility information
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="text-center bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg text-card-foreground">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Comprehensive analytics and platform management tools</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api-docs">
              <Card className="text-center bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg text-card-foreground">API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete reference for all 15 API endpoints and integration guides
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 TourismMap India. Powered by AI and Blockchain Technology.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="outline">15 API Endpoints</Badge>
            <Badge variant="outline">{activeModels.length} AI Models</Badge>
            <Badge variant="outline">Blockchain Verified</Badge>
            <Badge variant="outline">MetaMask Integrated</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
