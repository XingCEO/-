import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import prisma from '@/lib/prisma';
import WorksTable from '@/components/admin/works-table';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.admin.works.title,
  };
}

async function getWorks() {
  try {
    const works = await prisma.work.findMany({
      include: { category: true, images: true },
      orderBy: { order: 'asc' },
    });
    return works;
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const works = await getWorks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-semibold">
            {dict.admin.works.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {lang === 'zh-TW' ? '管理您的作品集' : 'Manage your portfolio works'}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${lang}/admin/works/new`}>
            <Plus className="w-4 h-4 mr-2" />
            {dict.admin.works.addNew}
          </Link>
        </Button>
      </div>

      <WorksTable works={works} lang={lang} dict={dict} />
    </div>
  );
}
