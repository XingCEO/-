'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';

interface CTASectionProps {
  lang: string;
  dict: any;
}

export default function CTASection({ lang, dict }: CTASectionProps) {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80')] bg-cover bg-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-6">
            {lang === 'zh-TW' ? '準備好捕捉您的精彩時刻了嗎？' : 'Ready to Capture Your Special Moments?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {lang === 'zh-TW'
              ? '讓我們一起創造永恆的回憶。立即聯繫我，開始規劃您的攝影專案。'
              : "Let's create lasting memories together. Contact me today to start planning your photography session."}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group"
            >
              <Link href={`/${lang}/contact`}>
                {dict.common.cta.bookNow}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
