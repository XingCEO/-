'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';

interface FeaturedWorksProps {
  lang: string;
  dict: any;
  works: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Demo works for initial display
const demoWorks = [
  {
    id: '1',
    slug: 'wedding-garden',
    titleEn: 'Garden Wedding',
    titleZhTW: '花園婚禮',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    category: { nameEn: 'Wedding', nameZhTW: '婚禮' },
  },
  {
    id: '2',
    slug: 'portrait-studio',
    titleEn: 'Studio Portrait',
    titleZhTW: '棚拍人像',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    category: { nameEn: 'Portrait', nameZhTW: '人像' },
  },
  {
    id: '3',
    slug: 'product-photography',
    titleEn: 'Product Showcase',
    titleZhTW: '商品攝影',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: { nameEn: 'Product', nameZhTW: '商品' },
  },
  {
    id: '4',
    slug: 'event-corporate',
    titleEn: 'Corporate Event',
    titleZhTW: '企業活動',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: { nameEn: 'Event', nameZhTW: '活動' },
  },
];

export default function FeaturedWorks({ lang, dict, works }: FeaturedWorksProps) {
  const displayWorks = works.length > 0 ? works : demoWorks;

  const getTitle = (work: any) => lang === 'zh-TW' ? work.titleZhTW : work.titleEn;
  const getCategoryName = (work: any) =>
    work.category ? (lang === 'zh-TW' ? work.category.nameZhTW : work.category.nameEn) : '';

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            {dict.home.featured.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dict.home.featured.subtitle}
          </p>
        </motion.div>

        {/* Works Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayWorks.slice(0, 4).map((work) => (
            <motion.div
              key={work.id}
              variants={itemVariants}
              className="group cursor-pointer"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={`/${lang}/portfolio/${work.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted border border-border/20 shadow-md dark:shadow-none dark:border-border/10">
                  <Image
                    src={work.coverImage}
                    alt={getTitle(work)}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Gradient Overlay - Always show a slight gradient at bottom for legibility, stronger on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/90 text-xs font-medium uppercase tracking-wider mb-2 opacity-80 group-hover:opacity-100 transition-opacity delay-100">
                      {getCategoryName(work)}
                    </p>
                    <h3 className="text-white font-playfair font-medium text-xl leading-tight opacity-90 group-hover:opacity-100 transition-opacity">
                      {getTitle(work)}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button asChild variant="outline" size="lg" className="group">
            <Link href={`/${lang}/portfolio`}>
              {dict.home.featured.viewAll}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
