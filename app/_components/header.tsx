/* eslint-disable @next/next/no-img-element */
import { Pump } from "@/.basehub/react-pump";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Link,
  Select,
  Separator,
  ThickChevronRightIcon,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { Search } from "./search";
import { Fragment } from "react";

import s from "./header.module.css";

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
                <Flex align="center" gap="2">
                  <Flex asChild align="center">
                    <NextLink href="/">
                      <img
                        src={settings.icon.url}
                        alt={settings.icon.alt ?? "icon"}
                        style={{ width: 28, height: 28 }}
                      />
                    </NextLink>
                  </Flex>
                  <ThickChevronRightIcon />
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
                    {settings.navLinks.items.map((item, i, { length }) => {
                      const isLast = i === length - 1;
                      if (isLast)
                        return (
                          <Fragment key={item._id}>
                            <Button asChild>
                              <NextLink href={item.href}>
                                {item._title}
                              </NextLink>
                            </Button>
                            <Separator />
                            <Select.Root defaultValue="system">
                              <Select.Trigger />
                              <Select.Content>
                                <Select.Item value="system">System</Select.Item>
                                <Select.Item value="light">Light</Select.Item>
                                <Select.Item value="dark">Dark</Select.Item>
                              </Select.Content>
                            </Select.Root>
                          </Fragment>
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
