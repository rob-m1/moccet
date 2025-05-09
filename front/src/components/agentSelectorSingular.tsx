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
import { Agent } from "./react-flow/interfaces";

export function ComboboxAgentSingular({
  onChange,
  agents,
  defaultValue = "",
}: {
  onChange?: (value: string) => void;
  agents: Agent[];
  defaultValue?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);

  const handleSelect = (selected: string) => {
    const finalValue = selected === selectedValue ? "" : selected;
    setSelectedValue(finalValue);
    onChange?.(finalValue);
    setOpen(false); // close after selection
  };

  const displayText =
    selectedValue && agents.find((a) => a.id === selectedValue)?.name
      ? agents.find((a) => a.id === selectedValue)?.name
      : "Select Agent...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search agents..." />
          <CommandList>
            <CommandEmpty>No agents found.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={() => handleSelect(agent.id)}
                >
                  {agent.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValue === agent.id ? "opacity-100" : "opacity-0"
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
