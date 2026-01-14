'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Locale } from '@/i18n/config';

interface WorksTableProps {
  works: any[];
  lang: string;
  dict: any;
}

export default function WorksTable({ works, lang, dict }: WorksTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/works/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(lang === 'zh-TW' ? '作品已刪除' : 'Work deleted');
        router.refresh();
      } else {
        toast.error(lang === 'zh-TW' ? '刪除失敗' : 'Failed to delete');
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });

      if (response.ok) {
        toast.success(
          !published
            ? lang === 'zh-TW' ? '已發布' : 'Published'
            : lang === 'zh-TW' ? '已取消發布' : 'Unpublished'
        );
        router.refresh();
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      });

      if (response.ok) {
        toast.success(
          !featured
            ? lang === 'zh-TW' ? '已設為精選' : 'Featured'
            : lang === 'zh-TW' ? '已取消精選' : 'Unfeatured'
        );
        router.refresh();
      }
    } catch (error) {
      toast.error(lang === 'zh-TW' ? '發生錯誤' : 'An error occurred');
    }
  };

  if (works.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{dict.admin.common.noData}</p>
          <Button asChild className="mt-4">
            <Link href={`/${lang}/admin/works/new`}>
              {dict.admin.works.addNew}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">
                  {lang === 'zh-TW' ? '封面' : 'Cover'}
                </TableHead>
                <TableHead>{lang === 'zh-TW' ? '標題' : 'Title'}</TableHead>
                <TableHead>{lang === 'zh-TW' ? '分類' : 'Category'}</TableHead>
                <TableHead className="text-center">
                  {lang === 'zh-TW' ? '狀態' : 'Status'}
                </TableHead>
                <TableHead className="text-center">
                  {lang === 'zh-TW' ? '精選' : 'Featured'}
                </TableHead>
                <TableHead className="text-right">
                  {lang === 'zh-TW' ? '操作' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((work) => (
                <TableRow key={work.id}>
                  <TableCell>
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                      {work.coverImage && (
                        <Image
                          src={work.coverImage}
                          alt={lang === 'zh-TW' ? work.titleZhTW : work.titleEn}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {lang === 'zh-TW' ? work.titleZhTW : work.titleEn}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {work.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    {work.category
                      ? lang === 'zh-TW'
                        ? work.category.nameZhTW
                        : work.category.nameEn
                      : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublish(work.id, work.published)}
                      title={work.published ? 'Unpublish' : 'Publish'}
                    >
                      {work.published ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(work.id, work.featured)}
                      title={work.featured ? 'Unfeature' : 'Feature'}
                    >
                      {work.featured ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${lang}/admin/works/${work.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(work.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {lang === 'zh-TW' ? '確認刪除' : 'Confirm Delete'}
            </DialogTitle>
            <DialogDescription>
              {dict.admin.works.confirmDelete}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {dict.admin.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? lang === 'zh-TW' ? '刪除中...' : 'Deleting...'
                : dict.admin.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
