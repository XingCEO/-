import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import GalleryGrid from '@/components/portfolio/gallery-grid';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.portfolio.title,
    description: dict.portfolio.subtitle,
  };
}

async function getWorks() {
  try {
    const works = await prisma.work.findMany({
      where: {
        published: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return works;
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [works, categories] = await Promise.all([getWorks(), getCategories()]);

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-semibold mb-4">
            {dict.portfolio.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dict.portfolio.subtitle}
          </p>
        </div>

        {/* Gallery */}
        <GalleryGrid works={works} categories={categories} lang={lang} dict={dict} />
      </div>
    </div>
  );
}
