import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const agents = [
  { value: "ai", label: "AI" },
  { value: "human", label: "Human" },
];

export function Combobox({
  onChange,
  defaultValue = "",
}: {
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const handleSelect = (newValue: string) => {
    const finalValue = newValue === value ? "" : newValue;
    setValue(finalValue);
    onChange?.(finalValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? agents.find((agent) => agent.value === value)?.label
            : "Select Agent Type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Agent Type..." />
          <CommandList>
            <CommandEmpty>No agent type found.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.value}
                  value={agent.value}
                  onSelect={handleSelect}
                >
                  {agent.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === agent.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
