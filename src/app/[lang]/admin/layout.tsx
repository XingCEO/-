import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import AdminSidebar from '@/components/admin/sidebar';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await getServerSession();
  const { lang } = await params;
  const locale = lang as Locale;

  if (!session) {
    redirect('/login');
  }

  const dict = await getDictionary(locale);

  return (
    <AuthProvider>
      {/* Hide parent navbar and footer using CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body > div > div > header,
          body > div > div > nav,
          body > div > div > footer,
          body > div > div > div > header,
          body > div > div > div > nav,
          body > div > div > div > footer,
          [class*="fixed"][class*="top-0"][class*="z-50"]:has(a[href$="/portfolio"]),
          header:has(a[href$="/portfolio"]),
          footer:has(a[href="/zh-TW"]),
          footer:has(a[href="/en"]) {
            display: none !important;
          }
          main.pt-16, main.lg\\:pt-20 {
            padding-top: 0 !important;
          }
        `
      }} />
      <div className="fixed inset-0 bg-muted/30 z-40 flex">
        <AdminSidebar lang={locale} dict={dict} user={session?.user} />
        <main className="flex-1 lg:pl-64 h-full overflow-y-auto flex flex-col pt-16 lg:pt-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-background/80 backdrop-blur border-b sticky top-0 z-30">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Admin Portal</span>
              <span>/</span>
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Place for potential future top-bar actions */}
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
