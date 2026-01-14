import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import WorkForm from '@/components/admin/work-form';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === 'zh-TW' ? '新增作品' : 'New Work',
  };
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function NewWorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const categories = await getCategories();

  return (
    <WorkForm lang={lang} dict={dict} categories={categories} />
  );
}
