import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { SiteSettings } from '@/lib/settings';

interface FooterProps {
  lang: string;
  dict: any;
  settings?: SiteSettings;
}

export default function Footer({ lang, dict, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const siteName = settings?.siteName || 'Studio';
  const siteEmail = settings?.siteEmail || 'contact@studio.com';
  const instagram = settings?.instagram || '#';
  const facebook = settings?.facebook || '#';

  const navItems = [
    { key: 'home', href: '' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={`/${lang}`} className="inline-block">
              <span className="font-playfair text-2xl font-semibold tracking-tight">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {dict.home.about.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${lang}${item.href}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {dict.common.nav[item.key]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              {dict.common.footer.followUs}
            </h3>
            <div className="flex space-x-4">
              <a
                href={instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${siteEmail}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {siteName}. {dict.common.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  );
}

