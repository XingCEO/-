import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import ContactForm from '@/components/contact/contact-form';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.contact.title,
    description: dict.contact.subtitle,
  };
}

// Demo services for contact form
const demoServices = [
  { id: '1', nameEn: 'Wedding Photography', nameZhTW: '婚禮攝影' },
  { id: '2', nameEn: 'Portrait Photography', nameZhTW: '人像攝影' },
  { id: '3', nameEn: 'Corporate Photography', nameZhTW: '企業攝影' },
  { id: '4', nameEn: 'Product Photography', nameZhTW: '商品攝影' },
  { id: '5', nameEn: 'Event Photography', nameZhTW: '活動攝影' },
  { id: '6', nameEn: 'Video Production', nameZhTW: '影片製作' },
];

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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : demoServices;
  const settings = await getSiteSettings();

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl sm:text-5xl font-semibold mb-4">
            {dict.contact.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dict.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6 sm:p-8">
              <ContactForm lang={lang} dict={dict} services={services} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-semibold text-lg mb-4">
                {dict.contact.info.title}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {dict.contact.info.email}
                    </div>
                    <a
                      href={`mailto:${settings.siteEmail}`}
                      className="hover:text-primary transition-colors"
                    >
                      {settings.siteEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {dict.contact.info.phone}
                    </div>
                    <a
                      href={`tel:${settings.sitePhone.replace(/\s/g, '')}`}
                      className="hover:text-primary transition-colors"
                    >
                      {settings.sitePhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {dict.contact.info.location}
                    </div>
                    <span>
                      {settings.siteAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-4">
                {dict.contact.info.social}
              </h2>
              <div className="flex gap-4">
                <a
                  href={settings.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={settings.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold mb-3">
                {lang === 'zh-TW' ? '營業時間' : 'Working Hours'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {lang === 'zh-TW' ? '週一至週五' : 'Monday - Friday'}
                  </span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {lang === 'zh-TW' ? '週六' : 'Saturday'}
                  </span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {lang === 'zh-TW' ? '週日' : 'Sunday'}
                  </span>
                  <span>{lang === 'zh-TW' ? '預約制' : 'By Appointment'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
