import { processPDF } from '@/lib/pdf';
import { Document } from '@langchain/core/documents';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'files' && value instanceof File) {
        files.push(value);
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate file count
    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Too many files. Maximum 5 files allowed.' },
        { status: 400 },
      );
    }

    // Validate file types and sizes
    const invalidFiles = files.filter((file) => {
      return (
        !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
      );
    });

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        {
          error:
            'Only PDF files are allowed and file size must be less than 10MB',
        },
        { status: 400 },
      );
    }

    const allDocs: Document[] = [];
    for (const file of files) {
      try {
        const docs = await processPDF(file);
        allDocs.push(...docs);
      } catch (error: any) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    if (!allDocs.length) {
      return NextResponse.json(
        { error: 'No valid documents extracted from uploaded files' },
        { status: 500 },
      );
    }

    const res = await fetch(`${process.env['NEXT_PLATFORM_API']}/ingestion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docs: allDocs,
      }),
    }).then((res) => res.json());

    return NextResponse.json({
      message: 'Documents ingested successfully',
      data: res,
      threadId: '',
    });
  } catch (error: any) {
    console.error('Error processing files:', error);
    return NextResponse.json(
      { error: 'Failed to process files', details: error.message },
      { status: 500 },
    );
  }
}
