'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';

const workSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  titleEn: z.string().min(1, 'English title is required'),
  titleZhTW: z.string().min(1, 'Chinese title is required'),
  descriptionEn: z.string().optional(),
  descriptionZhTW: z.string().optional(),
  coverImage: z.string().min(1, 'Cover image is required'),
  categoryId: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

type WorkFormData = z.infer<typeof workSchema>;

interface WorkFormProps {
  lang: string;
  dict: any;
  work?: any;
  categories: any[];
}

export default function WorkForm({ lang, dict, work, categories }: WorkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    work?.images?.map((img: any) => ({ url: img.url, alt: img.alt || '' })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      slug: work?.slug || '',
      titleEn: work?.titleEn || '',
      titleZhTW: work?.titleZhTW || '',
      descriptionEn: work?.descriptionEn || '',
      descriptionZhTW: work?.descriptionZhTW || '',
      coverImage: work?.coverImage || '',
      categoryId: work?.categoryId || '',
      date: work?.date ? new Date(work.date).toISOString().split('T')[0] : '',
      location: work?.location || '',
      client: work?.client || '',
      featured: work?.featured || false,
      published: work?.published ?? true,
    },
  });

  const onSubmit = async (data: WorkFormData) => {
    setIsSubmitting(true);
    try {
      const url = work ? `/api/works/${work.id}` : '/api/works';
      const method = work ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images,
        }),
      });

      if (response.ok) {
        toast.success(
          work
            ? lang === 'zh-TW' ? '作品已更新' : 'Work updated'
            : lang === 'zh-TW' ? '作品已建立' : 'Work created'
        );
        router.push(`/${lang}/admin/works`);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || (lang === 'zh-TW' ? '發生錯誤' : 'An error occurred'));
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { url: newImageUrl.trim(), alt: '' }]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/${lang}/admin/works`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === 'zh-TW' ? '返回' : 'Back'}
          </Link>
        </Button>
        <h1 className="font-playfair text-2xl font-semibold">
          {work
            ? lang === 'zh-TW' ? '編輯作品' : 'Edit Work'
            : lang === 'zh-TW' ? '新增作品' : 'New Work'}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'zh-TW' ? '基本資訊' : 'Basic Info'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">English Title *</Label>
                  <Input
                    id="titleEn"
                    {...register('titleEn')}
                    className={errors.titleEn ? 'border-destructive' : ''}
                  />
                  {errors.titleEn && (
                    <p className="text-sm text-destructive">{errors.titleEn.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleZhTW">中文標題 *</Label>
                  <Input
                    id="titleZhTW"
                    {...register('titleZhTW')}
                    className={errors.titleZhTW ? 'border-destructive' : ''}
                  />
                  {errors.titleZhTW && (
                    <p className="text-sm text-destructive">{errors.titleZhTW.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="my-work-title"
                  {...register('slug')}
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">English Description</Label>
                  <Textarea
                    id="descriptionEn"
                    rows={4}
                    {...register('descriptionEn')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionZhTW">中文描述</Label>
                  <Textarea
                    id="descriptionZhTW"
                    rows={4}
                    {...register('descriptionZhTW')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{lang === 'zh-TW' ? '圖片' : 'Images'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverImage">{lang === 'zh-TW' ? '封面圖片 URL' : 'Cover Image URL'} *</Label>
                <Input
                  id="coverImage"
                  placeholder="https://..."
                  {...register('coverImage')}
                  className={errors.coverImage ? 'border-destructive' : ''}
                />
                {errors.coverImage && (
                  <p className="text-sm text-destructive">{errors.coverImage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{lang === 'zh-TW' ? '相片集' : 'Gallery Images'}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <Button type="button" onClick={addImage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'zh-TW' ? '發布設定' : 'Publish'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">{lang === 'zh-TW' ? '發布' : 'Published'}</Label>
                <Switch
                  id="published"
                  checked={watch('published')}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">{lang === 'zh-TW' ? '精選' : 'Featured'}</Label>
                <Switch
                  id="featured"
                  checked={watch('featured')}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{lang === 'zh-TW' ? '詳細資訊' : 'Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">{lang === 'zh-TW' ? '分類' : 'Category'}</Label>
                <Select
                  value={watch('categoryId') || ''}
                  onValueChange={(value) => setValue('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={lang === 'zh-TW' ? '選擇分類' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {lang === 'zh-TW' ? cat.nameZhTW : cat.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{lang === 'zh-TW' ? '日期' : 'Date'}</Label>
                <Input id="date" type="date" {...register('date')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{lang === 'zh-TW' ? '地點' : 'Location'}</Label>
                <Input id="location" {...register('location')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">{lang === 'zh-TW' ? '客戶' : 'Client'}</Label>
                <Input id="client" {...register('client')} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? lang === 'zh-TW' ? '儲存中...' : 'Saving...'
              : lang === 'zh-TW' ? '儲存' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}
