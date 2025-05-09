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

export function ComboboxAgent({
  onChange,
  agents,
  defaultValues = [],
}: {
  onChange?: (values: string[]) => void;
  agents: Agent[]; // pass in full agent objects from parent
  defaultValues?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValues);
  const handleSelect = (selected: string) => {
    let updatedValues: string[];
    if (selectedValues.includes(selected)) {
      updatedValues = selectedValues.filter((v) => v !== selected);
    } else {
      updatedValues = [...selectedValues, selected];
    }
    setSelectedValues(updatedValues);
    onChange?.(updatedValues);
  };

  const displayText =
    selectedValues.length > 0
      ? agents
          .filter((a) => selectedValues.includes(a.id))
          .map((a) => a.name)
          .join(", ")
      : "Select Agents...";

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
              {agents && agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={() => handleSelect(agent.id)}
                >
                  {agent.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValues.includes(agent.id)
                        ? "opacity-100"
                        : "opacity-0"
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
