import { useQuery } from "@tanstack/react-query";
import { destinationService } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface DestinationSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function DestinationSelector({ selectedIds, onChange }: DestinationSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["destinations-all"],
    queryFn: () => destinationService.findAll(),
  });

  const destinations = response?.data || [];

  const toggleDestination = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedDestinations = destinations.filter((dest) => selectedIds.includes(dest.id));

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedDestinations.length > 0
              ? `${selectedDestinations.length} destination(s) selected`
              : "Select destinations..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search destinations..." />
            <CommandList>
              <CommandEmpty>No destination found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {destinations.map((destination) => (
                  <CommandItem
                    key={destination.id}
                    value={destination.name}
                    onSelect={() => toggleDestination(destination.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(destination.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{destination.name}</span>
                      <span className="text-xs text-muted-foreground">{destination.type}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedDestinations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDestinations.map((dest) => (
            <Badge key={dest.id} variant="secondary" className="flex items-center gap-1">
              {dest.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDestination(dest.id);
                }}
              >
                &times;
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
