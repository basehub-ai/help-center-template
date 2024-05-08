/* eslint-disable @next/next/no-img-element */
import { Pump } from "@/.basehub/react-pump";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Link,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { Search } from "./search";
import { Fragment } from "react";

import s from "./header.module.css";
import { ThemeSwitcher } from "./theme-switcher";
import { SlashIcon } from "@radix-ui/react-icons";

export const Header = () => {
  return (
    <Pump
      queries={[
        {
          index: {
            greeting: true,
          },
          settings: {
            icon: { url: true, alt: true },
            navLinks: {
              items: {
                _id: true,
                _title: true,
                href: true,
              },
            },
          },
        },
      ]}
    >
      {async ([{ index, settings }]) => {
        "use server";

        return (
          <Container className={s.container} pb="8">
            <Grid gap="9">
              <Flex align="center" justify="between" py="3">
                <Flex align="center" gap="1">
                  <Flex asChild align="center">
                    <NextLink href="/">
                      <img
                        src={settings.icon.url}
                        alt={settings.icon.alt ?? "icon"}
                        style={{ width: 28, height: 28 }}
                      />
                    </NextLink>
                  </Flex>
                  <SlashIcon color="var(--gray-11)" height={21} />
                  <Link
                    color="gray"
                    style={{ color: "var(--gray-12)" }}
                    asChild
                  >
                    <NextLink href="/">Help Center</NextLink>
                  </Link>
                </Flex>
                <Flex gap="4" align="center" asChild>
                  <nav>
                    <ThemeSwitcher />
                    {settings.navLinks.items.map((item, i, { length }) => {
                      const isLast = i === length - 1;
                      if (isLast)
                        return (
                            <Button key={item._id} asChild>
                              <NextLink href={item.href}>
                                {item._title}
                              </NextLink>
                            </Button>
                        );
                      return (
                        <Link key={item._id} color="gray" asChild>
                          <NextLink href={item.href}>{item._title}</NextLink>
                        </Link>
                      );
                    })}
                  </nav>
                </Flex>
              </Flex>

              <Flex direction="column" maxWidth="500px" mx="auto" gap="4">
                <Heading align="center" size="8" wrap="pretty">
                  {index.greeting}
                </Heading>
                <Search />
              </Flex>
            </Grid>
          </Container>
        );
      }}
    </Pump>
  );
};
