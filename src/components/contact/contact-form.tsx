'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  serviceId: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  lang: string;
  dict: any;
  services: any[];
}

export default function ContactForm({ lang, dict, services }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Update hidden input when date changes
  useEffect(() => {
    if (date) {
      setValue('preferredDate', format(date, 'yyyy-MM-dd'));
    }
  }, [date, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(dict.contact.form.success);
        reset();
        setDate(undefined);
      } else {
        toast.error(dict.contact.form.error);
      }
    } catch (error) {
      toast.error(dict.contact.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{dict.contact.form.name}</Label>
          <Input
            id="name"
            placeholder={dict.contact.form.namePlaceholder}
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{dict.contact.form.email}</Label>
          <Input
            id="email"
            type="email"
            placeholder={dict.contact.form.emailPlaceholder}
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{dict.contact.form.phone}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={dict.contact.form.phonePlaceholder}
            {...register('phone')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">{dict.contact.form.service}</Label>
          <Select onValueChange={(value) => setValue('serviceId', value)}>
            <SelectTrigger>
              <SelectValue placeholder={dict.contact.form.servicePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {lang === 'zh-TW' ? service.nameZhTW : service.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{dict.contact.form.date}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal border-input hover:bg-accent hover:text-accent-foreground",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: lang === 'zh-TW' ? zhTW : enUS })
              ) : (
                <span>{lang === 'zh-TW' ? '選擇日期' : 'Pick a date'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={lang === 'zh-TW' ? zhTW : enUS}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
        {/* Hidden input for form submission */}
        <input type="hidden" {...register('preferredDate')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{dict.contact.form.message}</Label>
        <Textarea
          id="message"
          placeholder={dict.contact.form.messagePlaceholder}
          rows={5}
          {...register('message')}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? dict.contact.form.submitting : dict.contact.form.submit}
      </Button>
    </form>
  );
}
