'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import WorkCard from './work-card';
import CategoryFilter from './category-filter';
import type { Locale } from '@/i18n/config';

interface GalleryGridProps {
  works: any[];
  categories: any[];
  lang: string;
  dict: any;
}

// Demo works for initial display
const demoWorks = [
  {
    id: '1',
    slug: 'wedding-garden',
    titleEn: 'Garden Wedding',
    titleZhTW: '花園婚禮',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    category: { id: 'wedding', nameEn: 'Wedding', nameZhTW: '婚禮' },
    categoryId: 'wedding',
  },
  {
    id: '2',
    slug: 'portrait-studio',
    titleEn: 'Studio Portrait',
    titleZhTW: '棚拍人像',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    category: { id: 'portrait', nameEn: 'Portrait', nameZhTW: '人像' },
    categoryId: 'portrait',
  },
  {
    id: '3',
    slug: 'product-photography',
    titleEn: 'Product Showcase',
    titleZhTW: '商品攝影',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: { id: 'product', nameEn: 'Product', nameZhTW: '商品' },
    categoryId: 'product',
  },
  {
    id: '4',
    slug: 'event-corporate',
    titleEn: 'Corporate Event',
    titleZhTW: '企業活動',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: { id: 'event', nameEn: 'Event', nameZhTW: '活動' },
    categoryId: 'event',
  },
  {
    id: '5',
    slug: 'wedding-beach',
    titleEn: 'Beach Wedding',
    titleZhTW: '海邊婚禮',
    coverImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
    category: { id: 'wedding', nameEn: 'Wedding', nameZhTW: '婚禮' },
    categoryId: 'wedding',
  },
  {
    id: '6',
    slug: 'portrait-outdoor',
    titleEn: 'Outdoor Portrait',
    titleZhTW: '戶外人像',
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    category: { id: 'portrait', nameEn: 'Portrait', nameZhTW: '人像' },
    categoryId: 'portrait',
  },
];

const demoCategories = [
  { id: 'wedding', nameEn: 'Wedding', nameZhTW: '婚禮' },
  { id: 'portrait', nameEn: 'Portrait', nameZhTW: '人像' },
  { id: 'product', nameEn: 'Product', nameZhTW: '商品' },
  { id: 'event', nameEn: 'Event', nameZhTW: '活動' },
];

export default function GalleryGrid({ works, categories, lang, dict }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayWorks = works.length > 0 ? works : demoWorks;
  const displayCategories = categories.length > 0 ? categories : demoCategories;

  const filteredWorks = useMemo(() => {
    if (!selectedCategory) return displayWorks;
    return displayWorks.filter((work) => work.categoryId === selectedCategory);
  }, [displayWorks, selectedCategory]);

  return (
    <div>
      <CategoryFilter
        categories={displayCategories}
        lang={lang}
        dict={dict}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredWorks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{dict.portfolio.noWorks}</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} lang={lang} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
