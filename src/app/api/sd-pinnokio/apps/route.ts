import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const databasePath = path.join(process.cwd(), 'sd-pinnokio-project', 'cleaned_pinokio_apps.json')
    
    if (!fs.existsSync(databasePath)) {
      console.log('Database file not found at:', databasePath)
      // Return sample data if database doesn't exist
      const sampleApps = [
        {
          id: 'stable-diffusion-webui',
          name: 'Stable Diffusion WebUI',
          description: 'A gradio web UI for running Stable Diffusion',
          category: 'AI Art',
          tags: ['stable-diffusion', 'gradio', 'webui'],
          vram: '4GB+',
          installed: false,
          running: false
        },
        {
          id: 'comfyui',
          name: 'ComfyUI',
          description: 'A powerful and modular stable diffusion GUI',
          category: 'AI Art',
          tags: ['stable-diffusion', 'node-based', 'workflow'],
          vram: '4GB+',
          installed: false,
          running: false
        },
        {
          id: 'automatic1111',
          name: 'Automatic1111',
          description: 'Popular Stable Diffusion web interface',
          category: 'AI Art',
          tags: ['stable-diffusion', 'automatic1111', 'webui'],
          vram: '4GB+',
          installed: false,
          running: false
        }
      ]
      
      return NextResponse.json(sampleApps)
    }
    
    console.log('Loading database from:', databasePath)
    const databaseContent = fs.readFileSync(databasePath, 'utf8')
    const appsData = JSON.parse(databaseContent)
    
    console.log(`Loaded ${Object.keys(appsData).length} apps from database`)
    
    // Transform the data to match our interface
    const transformedApps = Object.entries(appsData).map(([key, app]: [string, any]) => {
      // Extract VRAM info from tags if available
      const vramTag = app.tags?.find((tag: string) => tag.includes('GB') || tag.includes('VRAM'))
      
      return {
        id: key,
        name: app.name || key,
        description: app.description || 'No description available',
        category: app.category || 'Uncategorized',
        tags: app.tags || [],
        vram: vramTag || undefined,
        installed: false,
        running: false
      }
    })
    
    console.log(`Transformed ${transformedApps.length} apps for UI`)
    return NextResponse.json(transformedApps)
  } catch (error) {
    console.error('Error loading apps database:', error)
    return NextResponse.json({ error: 'Failed to load apps database' }, { status: 500 })
  }
}