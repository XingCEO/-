'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import type { Locale } from '@/i18n/config';

const categorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameZhTW: z.string().min(1),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoriesManagerProps {
  categories: any[];
  lang: string;
  dict: any;
}

export default function CategoriesManager({ categories, lang, dict }: CategoriesManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const openDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      reset({
        slug: category.slug,
        nameEn: category.nameEn,
        nameZhTW: category.nameZhTW,
      });
    } else {
      setEditingCategory(null);
      reset({ slug: '', nameEn: '', nameZhTW: '' });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingCategory
            ? lang === 'zh-TW' ? '分類已更新' : 'Category updated'
            : lang === 'zh-TW' ? '分類已建立' : 'Category created'
        );
        setIsDialogOpen(false);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || (lang === 'zh-TW' ? '發生錯誤' : 'An error occurred'));
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(lang === 'zh-TW' ? '分類已刪除' : 'Category deleted');
        router.refresh();
      } else {
        toast.error(lang === 'zh-TW' ? '刪除失敗' : 'Failed to delete');
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    } finally {
      setIsLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{dict.admin.categories.title}</CardTitle>
          <Button onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            {dict.admin.categories.addNew}
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {dict.admin.common.noData}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>English Name</TableHead>
                  <TableHead>中文名稱</TableHead>
                  <TableHead>{lang === 'zh-TW' ? '作品數' : 'Works'}</TableHead>
                  <TableHead className="text-right">
                    {lang === 'zh-TW' ? '操作' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm">
                      {category.slug}
                    </TableCell>
                    <TableCell>{category.nameEn}</TableCell>
                    <TableCell>{category.nameZhTW}</TableCell>
                    <TableCell>{category._count?.works || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? lang === 'zh-TW' ? '編輯分類' : 'Edit Category'
                : lang === 'zh-TW' ? '新增分類' : 'New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="my-category"
                {...register('slug')}
                className={errors.slug ? 'border-destructive' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">English Name</Label>
              <Input
                id="nameEn"
                {...register('nameEn')}
                className={errors.nameEn ? 'border-destructive' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameZhTW">中文名稱</Label>
              <Input
                id="nameZhTW"
                {...register('nameZhTW')}
                className={errors.nameZhTW ? 'border-destructive' : ''}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {dict.admin.common.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? lang === 'zh-TW' ? '儲存中...' : 'Saving...'
                  : dict.admin.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {lang === 'zh-TW' ? '確認刪除' : 'Confirm Delete'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {lang === 'zh-TW'
              ? '確定要刪除此分類嗎？此操作無法復原。'
              : 'Are you sure you want to delete this category? This action cannot be undone.'}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {dict.admin.common.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {dict.admin.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
