import type { Metadata } from 'next'
import { Header } from './_components/header'
import { ThemeProvider } from './_components/theme-provider/server'
import { basehub } from '@/.basehub'
import { Pump } from '@/.basehub/react-pump'

import './globals.css'
import { Footer } from './_components/footer'
import { IntercomProvider } from './_components/intercom'

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await basehub().query({
    settings: {
      icon: { url: true },
      metadata: {
        title: true,
        description: true,
        ogImage: { url: true, width: true, height: true, alt: true },
      },
    },
  })

  return {
    title: {
      default: data.settings.metadata.title,
      template: `%s | ${data.settings.metadata.title}`,
    },
    description: data.settings.metadata.description,
    icons: [{ url: data.settings.icon.url }],
    openGraph: {
      images: [
        {
          url: data.settings.metadata.ogImage.url,
          width: data.settings.metadata.ogImage.width,
          height: data.settings.metadata.ogImage.height,
          alt: data.settings.metadata.ogImage.alt ?? undefined,
        },
      ],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Pump queries={[{ settings: { icon: { url: true } } }]}>
        {async ([data]) => {
          'use server'

          return (
            <>
              <link rel="icon" href={data.settings.icon.url} sizes="any" />
            </>
          )
        }}
      </Pump>
      <body>
        <ThemeProvider>
          <IntercomProvider>
            <Header />
            {children}
            <Footer />
          </IntercomProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
