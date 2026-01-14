import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import HeroSection from '@/components/home/hero-section';
import FeaturedWorks from '@/components/home/featured-works';
import AboutSection from '@/components/home/about-section';
import CTASection from '@/components/home/cta-section';
import prisma from '@/lib/prisma';

async function getFeaturedWorks() {
  try {
    const works = await prisma.work.findMany({
      where: {
        featured: true,
        published: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        order: 'asc',
      },
      take: 4,
    });
    return works;
  } catch (error) {
    console.error('Error fetching featured works:', error);
    return [];
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const featuredWorks = await getFeaturedWorks();

  return (
    <>
      <HeroSection lang={lang} dict={dict} />
      <FeaturedWorks lang={lang} dict={dict} works={featuredWorks} />
      <AboutSection lang={lang} dict={dict} />
      <CTASection lang={lang} dict={dict} />
    </>
  );
}
