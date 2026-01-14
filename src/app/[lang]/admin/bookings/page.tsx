import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';
import BookingsManager from '@/components/admin/bookings-manager';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.admin.bookings.title,
  };
}

async function getBookings() {
  try {
    return await prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold">
          {dict.admin.bookings.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          {lang === 'zh-TW' ? '管理預約與詢問' : 'Manage bookings and inquiries'}
        </p>
      </div>

      <BookingsManager bookings={bookings} lang={lang} dict={dict} />
    </div>
  );
}
