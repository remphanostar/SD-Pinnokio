'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Download, Play, ExternalLink, Settings, Database, AlertCircle } from 'lucide-react'

interface PinokioApp {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  vram?: string
  installed: boolean
  running: boolean
  tunnelUrl?: string
}

export default function SDPinnokioPage() {
  const [apps, setApps] = useState<PinokioApp[]>([])
  const [filteredApps, setFilteredApps] = useState<PinokioApp[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState({
    environment: false,
    repository: false,
    database: false,
    shellRunner: false
  })
  const [installProgress, setInstallProgress] = useState<{[key: string]: number}>({})
  const [logs, setLogs] = useState<{[key: string]: string[]}>({})

  // Initialize and load apps
  useEffect(() => {
    initializeSystem()
  }, [])

  // Filter apps based on search and filters
  useEffect(() => {
    let filtered = apps

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory)
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(app => app.tags.includes(selectedTag))
    }

    setFilteredApps(filtered)
  }, [apps, searchTerm, selectedCategory, selectedTag])

  const initializeSystem = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check system status
      await checkSystemStatus()
      
      // Load apps database
      await loadAppsDatabase()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize system')
    } finally {
      setLoading(false)
    }
  }

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('/api/sd-pinnokio/status')
      const status = await response.json()
      setSystemStatus(status)
    } catch (err) {
      console.error('Failed to check system status:', err)
    }
  }

  const loadAppsDatabase = async () => {
    try {
      const response = await fetch('/api/sd-pinnokio/apps')
      if (!response.ok) {
        throw new Error('Failed to load apps database')
      }
      const appsData = await response.json()
      setApps(appsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps database')
    }
  }

  const handleInstall = async (appId: string) => {
    try {
      setInstallProgress(prev => ({ ...prev, [appId]: 0 }))
      setLogs(prev => ({ ...prev, [appId]: ['Starting installation...'] }))
      
      const response = await fetch(`/api/sd-pinnokio/install/${appId}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Installation failed')
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setInstallProgress(prev => {
          const current = prev[appId] || 0
          if (current >= 100) {
            clearInterval(progressInterval)
            return { ...prev, [appId]: 100 }
          }
          return { ...prev, [appId]: current + 10 }
        })
      }, 500)
      
      // Update app status
      setApps(prev => prev.map(app => 
        app.id === appId ? { ...app, installed: true } : app
      ))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed')
    }
  }

  const handleRun = async (appId: string) => {
    try {
      const response = await fetch(`/api/sd-pinnokio/run/${appId}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to run app')
      }
      
      setApps(prev => prev.map(app => 
        app.id === appId ? { ...app, running: true } : app
      ))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run app')
    }
  }

  const handleTunnel = async (appId: string) => {
    try {
      const response = await fetch(`/api/sd-pinnokio/tunnel/${appId}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to create tunnel')
      }
      
      const { url } = await response.json()
      setApps(prev => prev.map(app => 
        app.id === appId ? { ...app, tunnelUrl: url } : app
      ))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tunnel')
    }
  }

  const categories = [...new Set(apps.map(app => app.category))]
  const allTags = [...new Set(apps.flatMap(app => app.tags))]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SD-Pinnokio App Manager</h1>
          <p className="text-muted-foreground">Manage your Pinokio applications with ease</p>
        </div>
        <Button onClick={initializeSystem} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus.environment ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus.repository ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Repository</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus.database ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus.shellRunner ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Shell Runner</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Apps Grid */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading applications...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <div className="flex gap-1">
                    {app.installed && <Badge variant="secondary">Installed</Badge>}
                    {app.running && <Badge variant="default">Running</Badge>}
                  </div>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline">{app.category}</Badge>
                    {app.vram && (
                      <Badge variant="outline" className="ml-2">
                        VRAM: {app.vram}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {app.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {app.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{app.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {installProgress[app.id] !== undefined && installProgress[app.id] < 100 && (
                    <div className="space-y-2">
                      <Progress value={installProgress[app.id]} />
                      <p className="text-sm text-muted-foreground">
                        Installing... {installProgress[app.id]}%
                      </p>
                    </div>
                  )}

                  {logs[app.id] && (
                    <ScrollArea className="h-20 w-full border rounded p-2">
                      <div className="text-xs space-y-1">
                        {logs[app.id].map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    {!app.installed ? (
                      <Button 
                        onClick={() => handleInstall(app.id)}
                        className="flex-1"
                        disabled={installProgress[app.id] !== undefined && installProgress[app.id] < 100}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => handleRun(app.id)}
                          variant={app.running ? "secondary" : "default"}
                          disabled={app.running}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {app.running ? 'Running' : 'Run'}
                        </Button>
                        <Button 
                          onClick={() => handleTunnel(app.id)}
                          variant="outline"
                          disabled={!app.running}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Tunnel
                        </Button>
                      </>
                    )}
                  </div>

                  {app.tunnelUrl && (
                    <div className="text-sm">
                      <p className="font-medium">Tunnel URL:</p>
                      <a 
                        href={app.tunnelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {app.tunnelUrl}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredApps.length === 0 && !loading && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No applications found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}