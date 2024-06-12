import type { Metadata } from 'next'
import { Header } from './_components/header'
import { ThemeProvider } from './_components/theme-provider/server'
import { basehub } from '@/.basehub'
import { Pump } from '@/.basehub/react-pump'
import { Toolbar } from '@/.basehub/next-toolbar'

import './globals.css'
import { Footer } from './_components/footer'
import { IntercomProvider } from './_components/intercom'
import { SearchProvider } from './_components/search'
import { draftMode } from 'next/headers'
import { MetadataFragment } from './_fragments'

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await basehub({
    next: { revalidate: 120 },
    draft: draftMode().isEnabled,
  }).query({
    settings: {
      logo: { url: true },
      metadata: {
        ...MetadataFragment,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { settings, _componentInstances } = await basehub({
    draft: draftMode().isEnabled,
  }).query({
    _componentInstances: { articlesItem: { _searchKey: true } },
    settings: { intercomAppId: true },
  })

  const _searchKey = _componentInstances.articlesItem._searchKey

  return (
    <html lang="en">
      <Toolbar />
      <Pump
        draft={draftMode().isEnabled}
        queries={[{ settings: { metadata: { icon: { url: true } } } }]}
        next={{ revalidate: 60 }}
      >
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
          <IntercomProvider appId={settings.intercomAppId}>
            <SearchProvider _searchKey={_searchKey}>
              <Header />
              {children}
            </SearchProvider>
            <Footer />
          </IntercomProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
