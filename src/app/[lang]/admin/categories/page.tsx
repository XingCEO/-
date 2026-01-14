import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import CategoriesManager from '@/components/admin/categories-manager';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.admin.categories.title,
  };
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: { _count: { select: { works: true } } },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold">
          {dict.admin.categories.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          {lang === 'zh-TW' ? '管理作品分類' : 'Manage work categories'}
        </p>
      </div>

      <CategoriesManager categories={categories} lang={lang} dict={dict} />
    </div>
  );
}
