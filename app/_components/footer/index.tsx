import { Pump } from '@/.basehub/react-pump'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import {
  Flex,
  IconButton,
  Separator,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import NextLink from 'next/link'

export const Footer = async () => {
  return (
    <Pump
      draft={(await draftMode()).isEnabled}
      queries={[
        {
          index: {
            rights: true,
            socialMediaLinks: {
              items: {
                _id: true,
                platform: true,
                url: true,
              },
            },
          },
          settings: {
            logo: { url: true, alt: true, width: true, height: true },
            logoLightMode: { url: true, alt: true, width: true, height: true },
            showUseTemplate: true,
          },
        },
      ]}
      next={{ revalidate: 60 }}
    >
      {async ([{ index, settings }]) => {
        'use server'

        return (
          <Flex
            style={{ borderTop: '1px solid var(--gray-3)' }}
            px={{ initial: '5', md: '64px', lg: '142px' }}
            direction="column"
            justify="center"
            align="center"
            pt="9"
            pb="80px"
          >
            {settings.logo && (
              <Image
                className="dark-only"
                {...settings.logo}
                src={settings.logo.url}
                alt={settings.logo?.alt ?? ''}
                style={{ maxHeight: 28 }}
              />
            )}
            {settings.logoLightMode && (
              <Image
                className="light-only"
                {...settings.logoLightMode}
                src={settings.logoLightMode.url}
                alt={settings.logoLightMode?.alt ?? ''}
                style={{ maxHeight: 28 }}
              />
            )}
            <Text size="1" color="gray" mt="3">
              {index.rights}
            </Text>
            <Separator
              mt="6"
              mb="5"
              style={{
                maxWidth: 526,
                width: '91vw',
                backgroundColor: 'var(--focus-9)',
                maskImage:
                  'linear-gradient(90deg, transparent, black, transparent)',
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent, black, transparent)',
              }}
            />
            <Flex gap="3">
              {index.socialMediaLinks.items.map((item) => {
                const icon = icons[
                  item.platform.toLowerCase() as keyof typeof icons
                ] ?? <QuestionMarkCircledIcon height={20} width={20} />
                return (
                  <IconButton
                    asChild
                    key={item._id}
                    variant="ghost"
                    style={{ flexShrink: 0 }}
                    color="gray"
                    aria-label={item.platform}
                  >
                    <NextLink href={item.url} target="_blank">
                      {icon}
                      <VisuallyHidden>{item.platform}</VisuallyHidden>
                    </NextLink>
                  </IconButton>
                )
              })}
            </Flex>
            {settings.showUseTemplate && (
              <Flex
                maxWidth="max-content"
                mx="auto"
                asChild
                align="center"
                justify="center"
                mt="8"
              >
                <NextLink
                  target="_blank"
                  href="https://basehub.com/basehub/help-center"
                >
                  <Image
                    alt="Use BaseHub template"
                    src="https://basehub.com/template-button.svg"
                    width={150}
                    height={28}
                    style={{
                      height: 28,
                      width: 'auto',
                    }}
                  />
                </NextLink>
              </Flex>
            )}
          </Flex>
        )
      }}
    </Pump>
  )
}

const icons = {
  facebook: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'calc(var(--space-5) * var(--scaling))',
        height: 'calc(var(--space-5) * var(--scaling))',
      }}
    >
      <path
        d="M10 2.5C5.85775 2.5 2.5 5.85775 2.5 10C2.5 13.7433 5.24275 16.846 8.8285 17.4092V12.1675H6.9235V10H8.8285V8.34775C8.8285 6.46825 9.9475 5.43025 11.6613 5.43025C12.4818 5.43025 13.3397 5.5765 13.3397 5.5765V7.4215H12.3947C11.4625 7.4215 11.1722 7.99975 11.1722 8.593V10H13.252L12.9197 12.1675H11.1722V17.4092C14.7572 16.8467 17.5 13.7425 17.5 10C17.5 5.85775 14.1422 2.5 10 2.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  x: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'calc(var(--space-5) * var(--scaling))',
        height: 'calc(var(--space-5) * var(--scaling))',
      }}
    >
      <path
        d="M7.5 3.75H3.125L8.28804 10.6341L3.40622 16.2499H5.06249L9.05519 11.6569L12.5 16.25H16.875L11.4948 9.07644L16.1251 3.75H14.4688L10.7277 8.05361L7.5 3.75ZM13.125 15L5.625 5H6.875L14.375 15H13.125Z"
        fill="currentColor"
      />
    </svg>
  ),
  github: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'calc(var(--space-5) * var(--scaling))',
        height: 'calc(var(--space-5) * var(--scaling))',
      }}
    >
      <path
        d="M10 2.5C5.85625 2.5 2.5 5.85625 2.5 10C2.49915 11.5745 2.99411 13.1092 3.91466 14.3865C4.83521 15.6638 6.13461 16.6188 7.6285 17.116C8.0035 17.1813 8.14375 16.9562 8.14375 16.759C8.14375 16.5812 8.134 15.991 8.134 15.3625C6.25 15.7098 5.7625 14.9035 5.6125 14.4813C5.52775 14.2653 5.1625 13.6 4.84375 13.4215C4.58125 13.2812 4.20625 12.934 4.834 12.925C5.425 12.9152 5.8465 13.4687 5.9875 13.6937C6.6625 14.8277 7.741 14.509 8.1715 14.3125C8.2375 13.825 8.434 13.4972 8.65 13.3097C6.98125 13.1222 5.2375 12.475 5.2375 9.60625C5.2375 8.79025 5.52775 8.116 6.00625 7.59025C5.93125 7.40275 5.66875 6.634 6.08125 5.60275C6.08125 5.60275 6.709 5.40625 8.14375 6.37225C8.7543 6.2028 9.38513 6.11751 10.0188 6.11875C10.6563 6.11875 11.2938 6.20275 11.8938 6.3715C13.3278 5.3965 13.9563 5.6035 13.9563 5.6035C14.3688 6.63475 14.1063 7.4035 14.0313 7.591C14.509 8.116 14.8 8.78125 14.8 9.60625C14.8 12.4848 13.0473 13.1222 11.3785 13.3097C11.65 13.5437 11.8848 13.9938 11.8848 14.6973C11.8848 15.7 11.875 16.5063 11.875 16.7598C11.875 16.9563 12.016 17.1902 12.391 17.1152C13.8798 16.6126 15.1734 15.6557 16.0899 14.3794C17.0064 13.103 17.4996 11.5713 17.5 10C17.5 5.85625 14.1438 2.5 10 2.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  linkedin: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'calc(var(--space-5) * var(--scaling))',
        height: 'calc(var(--space-5) * var(--scaling))',
      }}
    >
      <path
        d="M14.7512 14.7543H12.7525V11.6215C12.7525 10.8745 12.7375 9.913 11.71 9.913C10.6682 9.913 10.5092 10.726 10.5092 11.5667V14.7543H8.50975V8.3125H10.4297V9.19H10.456C10.7245 8.6845 11.377 8.14975 12.352 8.14975C14.377 8.14975 14.752 9.48325 14.752 11.218V14.7543H14.7512ZM6.25225 7.43125C6.09967 7.43145 5.94854 7.40153 5.80755 7.3432C5.66655 7.28488 5.53845 7.1993 5.43059 7.09138C5.32273 6.98345 5.23724 6.85529 5.17901 6.71426C5.12078 6.57322 5.09095 6.42208 5.09125 6.2695C5.0914 6.03988 5.15963 5.81545 5.28733 5.62461C5.41503 5.43377 5.59645 5.28508 5.80865 5.19734C6.02085 5.1096 6.2543 5.08676 6.47949 5.13171C6.70467 5.17665 6.91147 5.28736 7.07373 5.44983C7.23599 5.6123 7.34644 5.81925 7.39109 6.04449C7.43574 6.26973 7.4126 6.50315 7.32459 6.71524C7.23658 6.92733 7.08765 7.10855 6.89664 7.236C6.70564 7.36345 6.48112 7.4314 6.2515 7.43125H6.25225ZM7.25425 14.7543H5.2495V8.3125H7.255V14.7543H7.25425ZM15.7525 3.25H4.24675C3.69475 3.25 3.25 3.685 3.25 4.22275V15.7772C3.25 16.315 3.6955 16.75 4.246 16.75H15.7495C16.3 16.75 16.75 16.315 16.75 15.7772V4.22275C16.75 3.685 16.3 3.25 15.7495 3.25H15.7518H15.7525Z"
        fill="currentColor"
      />
    </svg>
  ),
  discord: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'calc(var(--space-5) * var(--scaling))',
        height: 'calc(var(--space-5) * var(--scaling))',
      }}
    >
      <path
        d="M8.557 9.25C9.007 9.25 9.3715 9.5875 9.36325 10C9.36325 10.4125 9.00775 10.75 8.557 10.75C8.1145 10.75 7.75 10.4125 7.75 10C7.75 9.5875 8.10625 9.25 8.557 9.25ZM11.443 9.25C11.8938 9.25 12.25 9.5875 12.25 10C12.25 10.4125 11.8938 10.75 11.443 10.75C11.0005 10.75 10.6368 10.4125 10.6368 10C10.6368 9.5875 10.9922 9.25 11.443 9.25ZM15.1683 2.5C16.0405 2.5 16.75 3.2245 16.75 4.12225V18.25L15.0917 16.7537L14.158 15.8717L13.1702 14.9342L13.5798 16.3915H4.83175C3.9595 16.3915 3.25 15.667 3.25 14.7692V4.12225C3.25 3.2245 3.9595 2.5 4.83175 2.5H15.1675H15.1683ZM12.1908 12.7847C13.8955 12.73 14.5518 11.5877 14.5518 11.5877C14.5518 9.052 13.4403 6.99625 13.4403 6.99625C12.3302 6.1465 11.2727 6.16975 11.2727 6.16975L11.1648 6.29575C12.4765 6.70525 13.0855 7.29625 13.0855 7.29625C12.3693 6.89274 11.58 6.63575 10.7635 6.54025C10.2456 6.48175 9.72245 6.48679 9.20575 6.55525C9.15925 6.55525 9.12025 6.5635 9.0745 6.571C8.8045 6.595 8.14825 6.697 7.32325 7.0675C7.03825 7.201 6.868 7.29625 6.868 7.29625C6.868 7.29625 7.5085 6.67375 8.89675 6.26425L8.8195 6.16975C8.8195 6.16975 7.76275 6.1465 6.652 6.997C6.652 6.997 5.54125 9.052 5.54125 11.5877C5.54125 11.5877 6.18925 12.7292 7.894 12.7847C7.894 12.7847 8.179 12.4307 8.4115 12.1315C7.43125 11.8315 7.0615 11.2015 7.0615 11.2015C7.0615 11.2015 7.138 11.257 7.27675 11.3358C7.28425 11.3433 7.29175 11.3515 7.3075 11.359C7.33075 11.3755 7.354 11.383 7.37725 11.3988C7.57 11.509 7.76275 11.5953 7.93975 11.6665C8.25625 11.7925 8.63425 11.9185 9.0745 12.0055C9.73399 12.1348 10.4121 12.1373 11.0725 12.013C11.4572 11.9443 11.8325 11.8308 12.1908 11.6747C12.4607 11.572 12.7615 11.422 13.078 11.2098C13.078 11.2098 12.6925 11.8555 11.6815 12.1473C11.9132 12.4465 12.1915 12.7847 12.1915 12.7847H12.1908Z"
        fill="currentColor"
      />
    </svg>
  ),
}
