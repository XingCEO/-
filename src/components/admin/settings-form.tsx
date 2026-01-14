'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SettingsFormProps {
    lang: string;
    dict: any;
}

export default function SettingsForm({ lang, dict }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [formData, setFormData] = useState({
        siteName: 'Studio',
        siteEmail: 'contact@studio.com',
        sitePhone: '+886 912 345 678',
        siteAddress: lang === 'zh-TW' ? '台北市信義區' : 'Xinyi District, Taipei',
        instagram: '',
        facebook: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Load existing settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/admin/settings');
                if (response.ok) {
                    const data = await response.json();
                    setFormData((prev) => ({
                        ...prev,
                        siteName: data.siteName || prev.siteName,
                        siteEmail: data.siteEmail || prev.siteEmail,
                        sitePhone: data.sitePhone || prev.sitePhone,
                        siteAddress: data.siteAddress || prev.siteAddress,
                        instagram: data.instagram || '',
                        facebook: data.facebook || '',
                    }));
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setIsLoadingData(false);
            }
        };
        loadSettings();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate password if trying to change
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error(
                        lang === 'zh-TW' ? '新密碼與確認密碼不符' : 'Passwords do not match'
                    );
                    setIsLoading(false);
                    return;
                }
                if (!formData.currentPassword) {
                    toast.error(
                        lang === 'zh-TW' ? '請輸入目前密碼' : 'Please enter current password'
                    );
                    setIsLoading(false);
                    return;
                }
            }

            // Call API to save settings
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    siteName: formData.siteName,
                    siteEmail: formData.siteEmail,
                    sitePhone: formData.sitePhone,
                    siteAddress: formData.siteAddress,
                    instagram: formData.instagram,
                    facebook: formData.facebook,
                    ...(formData.newPassword && {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword,
                    }),
                }),
            });

            if (response.ok) {
                toast.success(
                    lang === 'zh-TW' ? '設定已儲存' : 'Settings saved successfully'
                );
                // Clear password fields
                setFormData((prev) => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
            } else {
                const data = await response.json();
                toast.error(data.error || (lang === 'zh-TW' ? '儲存失敗' : 'Failed to save'));
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error(lang === 'zh-TW' ? '儲存失敗' : 'Failed to save');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>{lang === 'zh-TW' ? '網站資訊' : 'Site Information'}</CardTitle>
                        <CardDescription>
                            {lang === 'zh-TW' ? '設定網站的基本資訊與聯繫方式' : 'Configure basic site information and contact details'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="siteName">{lang === 'zh-TW' ? '網站名稱' : 'Site Name'}</Label>
                            <Input
                                id="siteName"
                                value={formData.siteName}
                                onChange={handleInputChange}
                                placeholder="Studio Name"
                                className="max-w-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteEmail">{lang === 'zh-TW' ? '聯繫信箱' : 'Contact Email'}</Label>
                            <Input
                                id="siteEmail"
                                type="email"
                                value={formData.siteEmail}
                                onChange={handleInputChange}
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sitePhone">{lang === 'zh-TW' ? '聯繫電話' : 'Contact Phone'}</Label>
                            <Input
                                id="sitePhone"
                                value={formData.sitePhone}
                                onChange={handleInputChange}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="siteAddress">{lang === 'zh-TW' ? '地址' : 'Address'}</Label>
                            <Input
                                id="siteAddress"
                                value={formData.siteAddress}
                                onChange={handleInputChange}
                                placeholder="123 Street Name, City"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>{lang === 'zh-TW' ? '社群媒體' : 'Social Media'}</CardTitle>
                        <CardDescription>
                            {lang === 'zh-TW' ? '連結您的社群帳號' : 'Connect your social media accounts'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                                id="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/username"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>{lang === 'zh-TW' ? '安全性' : 'Security'}</CardTitle>
                        <CardDescription>
                            {lang === 'zh-TW' ? '更新管理員密碼' : 'Update admin password'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">{lang === 'zh-TW' ? '目前密碼' : 'Current Password'}</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">{lang === 'zh-TW' ? '新密碼' : 'New Password'}</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{lang === 'zh-TW' ? '確認新密碼' : 'Confirm New Password'}</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isLoading} className="min-w-[150px]">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dict.admin.settings.save}
                </Button>
            </div>
        </form>
    );
}
