import Image from 'next/image';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Camera, Heart, Award, Users } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.about.title,
    description: dict.about.subtitle,
  };
}

const stats = [
  { value: '10+', labelEn: 'Years Experience', labelZhTW: '年經驗' },
  { value: '500+', labelEn: 'Projects Completed', labelZhTW: '完成專案' },
  { value: '300+', labelEn: 'Happy Clients', labelZhTW: '滿意客戶' },
  { value: '50+', labelEn: 'Awards Won', labelZhTW: '獲獎數' },
];

const values = [
  {
    icon: Camera,
    titleEn: 'Quality First',
    titleZhTW: '品質至上',
    descEn: 'Every photo is crafted with meticulous attention to detail and professional expertise.',
    descZhTW: '每張照片都以細膩的專注力和專業技術精心打造。',
  },
  {
    icon: Heart,
    titleEn: 'Passion Driven',
    titleZhTW: '熱情驅動',
    descEn: 'Photography is not just my profession, it is my passion and way of seeing the world.',
    descZhTW: '攝影不僅是我的職業，更是我的熱情和看世界的方式。',
  },
  {
    icon: Users,
    titleEn: 'Client Focused',
    titleZhTW: '客戶至上',
    descEn: 'Your vision is my priority. I work closely with you to bring your ideas to life.',
    descZhTW: '您的願景是我的首要任務。我與您密切合作，將您的想法化為現實。',
  },
  {
    icon: Award,
    titleEn: 'Award Winning',
    titleZhTW: '屢獲殊榮',
    descEn: 'Recognized by industry professionals for creative excellence and technical mastery.',
    descZhTW: '因創意卓越和技術精湛而獲得業界專業人士的認可。',
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-playfair text-4xl sm:text-5xl font-semibold mb-6">
              {dict.about.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {dict.about.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {lang === 'zh-TW'
                ? '我是一位專業攝影師，擁有超過十年的攝影經驗。從婚禮到商業攝影，我致力於捕捉每個珍貴時刻，並將其轉化為永恆的藝術作品。我相信每張照片都有一個故事要說，而我的工作就是讓這些故事栩栩如生。'
                : 'I am a professional photographer with over a decade of experience. From weddings to commercial photography, I am dedicated to capturing every precious moment and transforming it into timeless art. I believe every photo has a story to tell, and my job is to bring those stories to life.'}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {lang === 'zh-TW'
                ? '我的攝影理念是自然與真實。我不追求過度修飾的完美，而是捕捉真實的情感和瞬間。無論是微笑、淚水還是歡笑，這些真實的情感才是最珍貴的。'
                : 'My photography philosophy is natural and authentic. I do not pursue over-processed perfection, but rather capture genuine emotions and moments. Whether it is smiles, tears, or laughter, these authentic emotions are what matter most.'}
            </p>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
                alt="Photographer"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-primary/20 rounded-lg -z-10" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-playfair text-4xl sm:text-5xl font-semibold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {lang === 'zh-TW' ? stat.labelZhTW : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-semibold mb-4">
            {lang === 'zh-TW' ? '我的理念' : 'My Values'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {lang === 'zh-TW'
              ? '這些核心價值引導著我的每一次拍攝'
              : 'These core values guide every shoot I do'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {lang === 'zh-TW' ? value.titleZhTW : value.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'zh-TW' ? value.descZhTW : value.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
