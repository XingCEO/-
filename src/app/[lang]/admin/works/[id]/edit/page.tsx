import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import WorkForm from '@/components/admin/work-form';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === 'zh-TW' ? '編輯作品' : 'Edit Work',
  };
}

async function getWork(id: string) {
  try {
    return await prisma.work.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  } catch (error) {
    console.error('Error fetching work:', error);
    return null;
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const [work, categories] = await Promise.all([getWork(id), getCategories()]);

  if (!work) {
    notFound();
  }

  return (
    <WorkForm lang={lang} dict={dict} work={work} categories={categories} />
  );
}
