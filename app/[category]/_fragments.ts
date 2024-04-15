import { fragmentOn } from "@/.basehub";

export const Category = fragmentOn("CategoriesItem", {
  _id: true,
  _title: true,
  _slug: true,
  description: true,
  icon: true,
  articles: {
    items: {
      _id: true,
      _slug: true,
      _title: true,
    },
  },
});

export type Category = fragmentOn.infer<typeof Category>;
