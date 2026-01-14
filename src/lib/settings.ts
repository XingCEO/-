import prisma from './prisma';

export interface SiteSettings {
    siteName: string;
    siteEmail: string;
    sitePhone: string;
    siteAddress: string;
    instagram: string;
    facebook: string;
}

const defaultSettings: SiteSettings = {
    siteName: 'Studio',
    siteEmail: 'contact@studio.com',
    sitePhone: '+886 912 345 678',
    siteAddress: '台北市信義區',
    instagram: '',
    facebook: '',
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const settings = await prisma.setting.findMany();

        const settingsMap: Record<string, string> = {};
        for (const setting of settings) {
            settingsMap[setting.key] = setting.value;
        }

        return {
            siteName: settingsMap.siteName || defaultSettings.siteName,
            siteEmail: settingsMap.siteEmail || defaultSettings.siteEmail,
            sitePhone: settingsMap.sitePhone || defaultSettings.sitePhone,
            siteAddress: settingsMap.siteAddress || defaultSettings.siteAddress,
            instagram: settingsMap.instagram || defaultSettings.instagram,
            facebook: settingsMap.facebook || defaultSettings.facebook,
        };
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return defaultSettings;
    }
}
