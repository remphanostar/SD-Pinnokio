import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Check if the SD-Pinnokio repository exists
    const repoPath = join(process.cwd(), 'sd-pinnokio-project', 'github_repo')
    const databasePath = join(process.cwd(), 'sd-pinnokio-project', 'cleaned_pinokio_apps.json')
    
    const status = {
      environment: true, // Assuming Next.js environment is ready
      repository: existsSync(repoPath),
      database: existsSync(databasePath),
      shellRunner: true // Will be checked when we fix the ShellRunner issue
    }
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error checking system status:', error)
    return NextResponse.json({ error: 'Failed to check system status' }, { status: 500 })
  }
}