import type { Metadata } from 'next'
import { Header } from './_components/header'
import { ThemeProvider } from './_components/theme-provider/server'
import { basehub } from '@/.basehub'
import { Pump } from '@/.basehub/react-pump'

import './globals.css'
import { Footer } from './_components/footer'
import { IntercomProvider } from './_components/intercom'
import { SearchProvider } from './_components/search'

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await basehub().query({
    settings: {
      logo: { url: true },
      metadata: {
        title: true,
        description: true,
        ogImage: { url: true, width: true, height: true, alt: true },
        icon: { url: true },
      },
    },
  })

  return {
    title: {
      default: data.settings.metadata.title,
      template: `%s | ${data.settings.metadata.title}`,
    },
    description: data.settings.metadata.description,
    icons: [{ url: data.settings.metadata.icon.url }],
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
      <Pump queries={[{ settings: { metadata: { icon: { url: true } } } }]}>
        {async ([data]) => {
          'use server'

          return (
            <>
              <link
                rel="icon"
                href={data.settings.metadata.icon.url}
                sizes="any"
              />
            </>
          )
        }}
      </Pump>
      <body>
        <ThemeProvider>
          <IntercomProvider>
            <Pump
              queries={[
                { _componentInstances: { articlesItem: { _searchKey: true } } },
              ]}
            >
              {async ([
                {
                  _componentInstances: {
                    articlesItem: { _searchKey },
                  },
                },
              ]) => {
                'use server'

                return (
                  <SearchProvider _searchKey={_searchKey}>
                    <Header />
                  </SearchProvider>
                )
              }}
            </Pump>
            {children}
            <Footer />
          </IntercomProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
