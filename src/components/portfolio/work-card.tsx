'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';

interface WorkCardProps {
  work: any;
  lang: string;
  index: number;
}

export default function WorkCard({ work, lang, index }: WorkCardProps) {
  const title = lang === 'zh-TW' ? work.titleZhTW : work.titleEn;
  const categoryName = work.category
    ? lang === 'zh-TW'
      ? work.category.nameZhTW
      : work.category.nameEn
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link href={`/${lang}/portfolio/${work.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <Image
            src={work.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {categoryName && (
              <p className="text-white/80 text-sm mb-1">{categoryName}</p>
            )}
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
