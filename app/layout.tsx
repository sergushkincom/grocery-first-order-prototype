import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ShopProvider } from '@/lib/shop-store'
import { SiteHeader } from '@/components/site-header'
import { PromoStrip } from '@/components/promo-strip'
import { SiteFooter } from '@/components/site-footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { WelcomeModal } from '@/components/welcome-modal'
import { AiFillPanel } from '@/components/ai-fill-panel'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Grocery Prototype – Erstbestellung',
  description: 'Klickbarer Prototyp für die Erstbestellung in einem Online-Supermarkt.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F07C22',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <ShopProvider>
          <PromoStrip />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WelcomeModal />
          <AiFillPanel />
        </ShopProvider>
        <Toaster position="bottom-center" style={{ fontFamily: 'inherit' }} />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
