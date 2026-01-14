import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import SettingsForm from '@/components/admin/settings-form';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.admin.settings.title,
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-semibold">
          {dict.admin.settings.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {lang === 'zh-TW' ? '管理網站設定' : 'Manage site settings'}
        </p>
      </div>

      <SettingsForm lang={lang} dict={dict} />
    </div>
  );
}

