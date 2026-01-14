import { ThemeProvider } from '@/providers/theme-provider';

export const metadata = {
  title: 'Login | Photography Portfolio',
  description: 'Admin login',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
