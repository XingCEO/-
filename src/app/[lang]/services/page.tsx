import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Users, Building2, Heart, Package, Video, ArrowRight, Check } from 'lucide-react';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.services.title,
    description: dict.services.subtitle,
  };
}

// Demo services
const demoServices = [
  {
    id: '1',
    slug: 'wedding',
    nameEn: 'Wedding Photography',
    nameZhTW: '婚禮攝影',
    descriptionEn: 'Capture your special day with timeless, elegant wedding photography. From preparation to reception, every moment preserved.',
    descriptionZhTW: '以永恆優雅的婚禮攝影捕捉您的特別日子。從準備到宴會，每個時刻都被完美保存。',
    price: 'NT$ 30,000',
    duration: '8 hours',
    icon: 'Heart',
    features: ['Pre-wedding consultation', '8 hours coverage', '500+ edited photos', 'Online gallery', 'USB drive'],
    featuresZhTW: ['婚前諮詢', '8小時拍攝', '500張以上修圖', '線上相簿', 'USB 隨身碟'],
  },
  {
    id: '2',
    slug: 'portrait',
    nameEn: 'Portrait Photography',
    nameZhTW: '人像攝影',
    descriptionEn: 'Professional portrait sessions for individuals, couples, or families. Studio or outdoor locations available.',
    descriptionZhTW: '為個人、情侶或家庭提供專業人像拍攝。可選擇室內或戶外場地。',
    price: 'NT$ 5,000',
    duration: '2 hours',
    icon: 'Users',
    features: ['2 hours session', '50+ edited photos', 'Outfit changes', 'Online gallery'],
    featuresZhTW: ['2小時拍攝', '50張以上修圖', '服裝更換', '線上相簿'],
  },
  {
    id: '3',
    slug: 'corporate',
    nameEn: 'Corporate Photography',
    nameZhTW: '企業攝影',
    descriptionEn: 'Professional corporate photography for headshots, team photos, and company events.',
    descriptionZhTW: '專業企業攝影，包括大頭照、團隊照片和公司活動。',
    price: 'NT$ 15,000',
    duration: '4 hours',
    icon: 'Building2',
    features: ['On-site shooting', 'Team and individual shots', 'Quick turnaround', 'Commercial license'],
    featuresZhTW: ['現場拍攝', '團隊與個人照', '快速交件', '商業授權'],
  },
  {
    id: '4',
    slug: 'product',
    nameEn: 'Product Photography',
    nameZhTW: '商品攝影',
    descriptionEn: 'High-quality product photography for e-commerce, catalogs, and marketing materials.',
    descriptionZhTW: '高品質商品攝影，適用於電商、目錄和行銷素材。',
    price: 'NT$ 3,000',
    duration: 'Per product',
    icon: 'Package',
    features: ['White background', 'Lifestyle shots', 'Retouching included', 'Multiple angles'],
    featuresZhTW: ['白背景', '情境照', '含修圖', '多角度拍攝'],
  },
  {
    id: '5',
    slug: 'event',
    nameEn: 'Event Photography',
    nameZhTW: '活動攝影',
    descriptionEn: 'Document your corporate events, parties, and special occasions with professional photography.',
    descriptionZhTW: '以專業攝影記錄您的企業活動、派對和特殊場合。',
    price: 'NT$ 10,000',
    duration: '4 hours',
    icon: 'Camera',
    features: ['Event coverage', 'Candid shots', 'Quick delivery', 'Online gallery'],
    featuresZhTW: ['活動記錄', '抓拍', '快速交件', '線上相簿'],
  },
  {
    id: '6',
    slug: 'video',
    nameEn: 'Video Production',
    nameZhTW: '影片製作',
    descriptionEn: 'Professional video production for weddings, events, and promotional content.',
    descriptionZhTW: '專業影片製作，包括婚禮、活動和宣傳內容。',
    price: 'NT$ 25,000',
    duration: 'Per project',
    icon: 'Video',
    features: ['4K quality', 'Drone footage', 'Professional editing', 'Music licensed'],
    featuresZhTW: ['4K 畫質', '空拍', '專業剪輯', '授權音樂'],
  },
];

const iconMap: Record<string, any> = {
  Heart,
  Users,
  Building2,
  Package,
  Camera,
  Video,
};

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : demoServices;

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl sm:text-5xl font-semibold mb-4">
            {dict.services.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service: any) => {
            const Icon = iconMap[service.icon || 'Camera'] || Camera;
            const name = lang === 'zh-TW' ? service.nameZhTW : service.nameEn;
            const description = lang === 'zh-TW' ? service.descriptionZhTW : service.descriptionEn;
            const features = lang === 'zh-TW' ? service.featuresZhTW : service.features;

            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-playfair text-xl">{name}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {service.price && (
                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">{dict.services.price}</span>
                      <div className="text-2xl font-semibold">{service.price}</div>
                    </div>
                  )}
                  {service.duration && (
                    <div className="mb-4 text-sm text-muted-foreground">
                      {dict.services.duration}: {service.duration}
                    </div>
                  )}
                  {features && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{dict.services.includes}:</div>
                      <ul className="space-y-1">
                        {(Array.isArray(features) ? features : []).map((feature: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/30 rounded-lg p-8 sm:p-12">
          <h2 className="font-playfair text-2xl sm:text-3xl font-semibold mb-4">
            {lang === 'zh-TW' ? '有特殊需求？' : 'Have Special Requirements?'}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {lang === 'zh-TW'
              ? '我們可以根據您的需求提供客製化方案。立即聯繫我們討論您的專案！'
              : 'We can provide customized packages based on your needs. Contact us now to discuss your project!'}
          </p>
          <Button asChild size="lg" className="group">
            <Link href={`/${lang}/contact`}>
              {dict.common.cta.getInTouch}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
