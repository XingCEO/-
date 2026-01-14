import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { i18n, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { headers } from 'next/headers';
import { getSiteSettings } from '@/lib/settings';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return {
    title: {
      default: 'Photography Portfolio',
      template: '%s | Photography Portfolio',
    },
    description: dict.home.hero.subtitle,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const settings = await getSiteSettings();

  // Check if current path is admin route
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const isAdminRoute = pathname.includes('/admin');

  // For admin routes, only render children with ThemeProvider (admin has its own layout)
  if (isAdminRoute) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative min-h-screen flex flex-col overflow-x-hidden">
        <Navbar lang={locale} dict={dict} siteName={settings.siteName} />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <Footer lang={locale} dict={dict} settings={settings} />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
