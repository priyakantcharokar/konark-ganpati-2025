import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderPath = searchParams.get('folder') || '/memories'
    
    // Base path for the public directory
    const publicPath = join(process.cwd(), 'public')
    const fullPath = join(publicPath, folderPath.replace(/^\//, ''))
    
    // Check if the path exists and is a directory
    try {
      const stats = await stat(fullPath)
      if (!stats.isDirectory()) {
        return NextResponse.json({ error: 'Path is not a directory' }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 })
    }

    // Read directory contents
    const items = await readdir(fullPath)
    const images: string[] = []
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP']
    
    for (const item of items) {
      const itemPath = join(fullPath, item)
      try {
        const itemStats = await stat(itemPath)
        
        if (itemStats.isFile()) {
          // Check if it's an image file
          const isImage = imageExtensions.some(ext => item.endsWith(ext))
          if (isImage) {
            // Convert to web-accessible path
            const webPath = `${folderPath}${item}`
            images.push(webPath)
          }
        } else if (itemStats.isDirectory()) {
          // Recursively get images from subdirectories
          const subImages = await getImagesFromDirectory(join(fullPath, item), `${folderPath}${item}/`)
          images.push(...subImages)
        }
      } catch (error) {
        console.warn(`Could not process item ${item}:`, error)
      }
    }
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error reading gallery images:', error)
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 })
  }
}

async function getImagesFromDirectory(dirPath: string, webPath: string): Promise<string[]> {
  try {
    const items = await readdir(dirPath)
    const images: string[] = []
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP']
    
    for (const item of items) {
      const itemPath = join(dirPath, item)
      try {
        const itemStats = await stat(itemPath)
        
        if (itemStats.isFile()) {
          const isImage = imageExtensions.some(ext => item.endsWith(ext))
          if (isImage) {
            const webImagePath = `${webPath}${item}`
            images.push(webImagePath)
          }
        }
      } catch (error) {
        console.warn(`Could not process subdirectory item ${item}:`, error)
      }
    }
    
    return images
  } catch (error) {
    console.warn(`Could not read subdirectory ${dirPath}:`, error)
    return []
  }
}
