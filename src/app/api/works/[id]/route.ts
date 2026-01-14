import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single work
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const work = await prisma.work.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    });

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    return NextResponse.json(work);
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json({ error: 'Failed to fetch work' }, { status: 500 });
  }
}

// PUT update work
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

    // Check if slug is taken by another work
    if (slug) {
      const existing = await prisma.work.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Delete existing images if new ones provided
    if (images) {
      await prisma.image.deleteMany({ where: { workId: id } });
    }

    const work = await prisma.work.update({
      where: { id },
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
        featured,
        published,
        order,
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

    return NextResponse.json(work);
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 });
  }
}

// PATCH partial update
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const work = await prisma.work.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(work);
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 });
  }
}

// DELETE work
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.work.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 });
  }
}
