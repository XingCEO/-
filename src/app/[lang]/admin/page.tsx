import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Calendar, FolderOpen, TrendingUp } from 'lucide-react';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.admin.dashboard.title,
  };
}

async function getStats() {
  try {
    const [totalWorks, totalBookings, newBookings, totalCategories] = await Promise.all([
      prisma.work.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'new' } }),
      prisma.category.count(),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    });

    return { totalWorks, totalBookings, newBookings, totalCategories, recentBookings };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalWorks: 0, totalBookings: 0, newBookings: 0, totalCategories: 0, recentBookings: [] };
  }
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const stats = await getStats();

  const statCards = [
    {
      title: dict.admin.dashboard.totalWorks,
      value: stats.totalWorks,
      icon: Image,
      color: 'text-blue-500',
    },
    {
      title: dict.admin.dashboard.totalBookings,
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-green-500',
    },
    {
      title: dict.admin.dashboard.newBookings,
      value: stats.newBookings,
      icon: TrendingUp,
      color: 'text-orange-500',
    },
    {
      title: lang === 'zh-TW' ? '分類數' : 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-semibold">
          {dict.admin.dashboard.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {lang === 'zh-TW' ? '歡迎回來！這是您的網站概覽。' : 'Welcome back! Here is your site overview.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{dict.admin.dashboard.recentBookings}</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {dict.admin.common.noData}
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{booking.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {booking.service
                        ? lang === 'zh-TW'
                          ? booking.service.nameZhTW
                          : booking.service.nameEn
                        : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString(
                        lang === 'zh-TW' ? 'zh-TW' : 'en-US'
                      )}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${booking.status === 'new'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : booking.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                    >
                      {(dict.admin.bookings.status as Record<string, string>)[booking.status] || booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
