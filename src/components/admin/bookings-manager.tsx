'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2 } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Locale } from '@/i18n/config';

interface BookingsManagerProps {
  bookings: any[];
  lang: string;
  dict: any;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function BookingsManager({ bookings, lang, dict }: BookingsManagerProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setNotes(booking.notes || '');
  };

  const updateBooking = async () => {
    if (!selectedBooking) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (response.ok) {
        toast.success(lang === 'zh-TW' ? '已更新' : 'Updated');
        setSelectedBooking(null);
        router.refresh();
      } else {
        toast.error(lang === 'zh-TW' ? '更新失敗' : 'Failed to update');
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
      const response = await fetch(`/api/bookings/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(lang === 'zh-TW' ? '已刪除' : 'Deleted');
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

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{dict.admin.common.noData}</p>
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
                <TableHead>{lang === 'zh-TW' ? '姓名' : 'Name'}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{lang === 'zh-TW' ? '服務' : 'Service'}</TableHead>
                <TableHead>{lang === 'zh-TW' ? '日期' : 'Date'}</TableHead>
                <TableHead>{lang === 'zh-TW' ? '狀態' : 'Status'}</TableHead>
                <TableHead className="text-right">
                  {lang === 'zh-TW' ? '操作' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>
                    {booking.service
                      ? lang === 'zh-TW'
                        ? booking.service.nameZhTW
                        : booking.service.nameEn
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.createdAt).toLocaleDateString(
                      lang === 'zh-TW' ? 'zh-TW' : 'en-US'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status] || ''}>
                      {dict.admin.bookings.status[booking.status] || booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetails(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(booking.id)}
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

      {/* Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {lang === 'zh-TW' ? '預約詳情' : 'Booking Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {lang === 'zh-TW' ? '姓名' : 'Name'}:
                  </span>
                  <p className="font-medium">{selectedBooking.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{selectedBooking.email}</p>
                </div>
                {selectedBooking.phone && (
                  <div>
                    <span className="text-muted-foreground">
                      {lang === 'zh-TW' ? '電話' : 'Phone'}:
                    </span>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                )}
                {selectedBooking.preferredDate && (
                  <div>
                    <span className="text-muted-foreground">
                      {lang === 'zh-TW' ? '希望日期' : 'Preferred Date'}:
                    </span>
                    <p className="font-medium">
                      {new Date(selectedBooking.preferredDate).toLocaleDateString(
                        lang === 'zh-TW' ? 'zh-TW' : 'en-US'
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  {lang === 'zh-TW' ? '訊息' : 'Message'}:
                </span>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedBooking.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{lang === 'zh-TW' ? '狀態' : 'Status'}</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(dict.admin.bookings.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {dict.admin.bookings.status[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{lang === 'zh-TW' ? '備註' : 'Notes'}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={lang === 'zh-TW' ? '內部備註...' : 'Internal notes...'}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              {dict.admin.common.cancel}
            </Button>
            <Button onClick={updateBooking} disabled={isLoading}>
              {isLoading
                ? lang === 'zh-TW' ? '儲存中...' : 'Saving...'
                : dict.admin.common.save}
            </Button>
          </DialogFooter>
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
              ? '確定要刪除此預約嗎？此操作無法復原。'
              : 'Are you sure you want to delete this booking? This action cannot be undone.'}
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
