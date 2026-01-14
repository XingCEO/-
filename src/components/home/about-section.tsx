'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Camera, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';

interface AboutSectionProps {
  lang: string;
  dict: any;
}

const features = [
  {
    icon: Camera,
    titleEn: 'Professional Equipment',
    titleZhTW: '專業設備',
    descEn: 'Using top-tier cameras and lenses for exceptional quality.',
    descZhTW: '使用頂級相機與鏡頭，確保卓越品質。',
  },
  {
    icon: Heart,
    titleEn: 'Passion & Dedication',
    titleZhTW: '熱情與專注',
    descEn: 'Every shot is captured with love and attention to detail.',
    descZhTW: '每一張照片都傾注熱情與細心。',
  },
  {
    icon: Award,
    titleEn: 'Years of Experience',
    titleZhTW: '豐富經驗',
    descEn: 'Over 10 years of professional photography experience.',
    descZhTW: '超過十年專業攝影經驗。',
  },
];

export default function AboutSection({ lang, dict }: AboutSectionProps) {
  return (
    <section className="py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left - Images Composition */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Image */}
            <div className="relative z-10 aspect-[3/4] w-[85%] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
                alt="Photographer"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Secondary Floating Image */}
            <div className="absolute top-[15%] right-0 w-[45%] aspect-square rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-background transform translate-x-4">
              <img
                src="https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80"
                alt="Studio"
                className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <span className="text-primary font-medium tracking-widest uppercase text-sm">
                {lang === 'zh-TW' ? '關於我們' : 'About Us'}
              </span>
              <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {dict.home.about.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                {dict.home.about.description}
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors duration-300 border border-transparent hover:border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-playfair font-semibold text-lg mb-2">
                    {lang === 'zh-TW' ? feature.titleZhTW : feature.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === 'zh-TW' ? feature.descZhTW : feature.descEn}
                  </p>
                </motion.div>
              ))}
            </div>

            <Button asChild size="lg" className="group rounded-full px-8">
              <Link href={`/${lang}/about`}>
                {dict.common.cta.learnMore}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
