import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all works
export async function GET() {
  try {
    const works = await prisma.work.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
  }
}

// POST new work
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      titleEn,
      titleZhTW,
      descriptionEn,
      descriptionZhTW,
      coverImage,
      categoryId,
      date,
      location,
      client,
      featured,
      published,
      order,
      images,
    } = body;

    // Validate required fields
    if (!slug || !titleEn || !titleZhTW || !coverImage) {
      return NextResponse.json(
        { error: 'Slug, titles, and cover image are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.work.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const work = await prisma.work.create({
      data: {
        slug,
        titleEn,
        titleZhTW,
        descriptionEn: descriptionEn || null,
        descriptionZhTW: descriptionZhTW || null,
        coverImage,
        categoryId: categoryId || null,
        date: date ? new Date(date) : null,
        location: location || null,
        client: client || null,
        featured: featured || false,
        published: published ?? true,
        order: order || 0,
        images: images?.length
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || null,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json({ error: 'Failed to create work' }, { status: 500 });
  }
}
