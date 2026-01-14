import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    return { title: 'Work Not Found' };
  }

  const title = lang === 'zh-TW' ? work.titleZhTW : work.titleEn;
  const description = lang === 'zh-TW' ? work.descriptionZhTW : work.descriptionEn;

  return {
    title,
    description: description || title,
  };
}

async function getWork(slug: string) {
  try {
    const work = await prisma.work.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return work;
  } catch (error) {
    console.error('Error fetching work:', error);
    return null;
  }
}

// Demo work for fallback
const demoWork = {
  id: '1',
  slug: 'wedding-garden',
  titleEn: 'Garden Wedding',
  titleZhTW: '花園婚禮',
  descriptionEn: 'A beautiful garden wedding ceremony captured in the golden hour. The couple celebrated their special day surrounded by nature and loved ones.',
  descriptionZhTW: '在黃金時刻捕捉的美麗花園婚禮。新人在大自然和親友的環繞下慶祝他們的特別日子。',
  coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  date: new Date('2024-06-15'),
  location: 'Taipei, Taiwan',
  client: 'John & Jane',
  category: { nameEn: 'Wedding', nameZhTW: '婚禮' },
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', alt: 'Wedding 1' },
    { id: '2', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80', alt: 'Wedding 2' },
    { id: '3', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', alt: 'Wedding 3' },
    { id: '4', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', alt: 'Wedding 4' },
  ],
};

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const dbWork = await getWork(slug);

  // Use demo work if not found (for demo purposes)
  const work = dbWork || demoWork as any;

  const title = lang === 'zh-TW' ? work.titleZhTW : work.titleEn;
  const description = lang === 'zh-TW' ? work.descriptionZhTW : work.descriptionEn;
  const categoryName = work.category
    ? lang === 'zh-TW'
      ? work.category.nameZhTW
      : work.category.nameEn
    : '';

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href={`/${lang}/portfolio`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === 'zh-TW' ? '返回作品集' : 'Back to Portfolio'}
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8">
          <Image
            src={work.coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Work Info */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h1 className="font-playfair text-4xl sm:text-5xl font-semibold mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {categoryName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium text-foreground">{dict.work.category}:</span>
                <span>{categoryName}</span>
              </div>
            )}
            {work.date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(work.date).toLocaleDateString(lang === 'zh-TW' ? 'zh-TW' : 'en-US')}</span>
              </div>
            )}
            {work.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{work.location}</span>
              </div>
            )}
            {work.client && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{work.client}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {work.images && work.images.length > 0 && (
          <div>
            <h2 className="font-playfair text-2xl font-semibold mb-6">
              {dict.work.gallery}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {work.images.map((image: any) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
