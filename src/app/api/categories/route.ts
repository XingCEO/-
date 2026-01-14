import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { works: true } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, nameEn, nameZhTW, descriptionEn, descriptionZhTW, order } = body;

    if (!slug || !nameEn || !nameZhTW) {
      return NextResponse.json(
        { error: 'Slug and names are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        slug,
        nameEn,
        nameZhTW,
        descriptionEn: descriptionEn || null,
        descriptionZhTW: descriptionZhTW || null,
        order: order || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
