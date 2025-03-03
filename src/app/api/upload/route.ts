import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const conversationId = formData.get('conversationId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760')
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds limit' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')
    await writeFile(join(uploadDir, file.name), Buffer.from(await file.arrayBuffer()))

    // Create attachment record
    const attachment = await prisma.attachment.create({
      data: {
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: join(process.env.UPLOAD_DIR || 'uploads', file.name),
        conversationId,
      },
    })

    return NextResponse.json(attachment)
  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    )
  }
} 