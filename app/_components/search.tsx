import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

export const Search = () => {
  return (
    <TextField.Root placeholder="Search articles...">
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};
