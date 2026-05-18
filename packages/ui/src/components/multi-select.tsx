"use client";

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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

export interface Option {
  label: string;
  value: string;
}

// ...existing imports...

interface MultipleSelectProps {
  options: Option[];
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxDisplay?: number;
  disabled?: boolean;
  className?: string;
  isSingle?: boolean; // <-- add this
}

export function MultipleSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  maxDisplay = 2,
  disabled = false,
  className,
  isSingle = false, // <-- add this
}: MultipleSelectProps) {
  const [open, setOpen] = useState(false);
  // Normalize value for single/multi mode
  const normalizedValue = isSingle
    ? typeof value === "string"
      ? value
        ? [value]
        : []
      : value.length > 0
        ? [value[0]]
        : []
    : Array.isArray(value)
      ? value
      : value
        ? [value]
        : [];

  const handleSelect = (selectedValue: string) => {
    if (isSingle) {
      onValueChange?.(selectedValue);
      setOpen(false);
    } else {
      const newValue = normalizedValue.includes(selectedValue)
        ? normalizedValue.filter((item) => item !== selectedValue)
        : [...normalizedValue, selectedValue];
      onValueChange?.(newValue.filter((v): v is string => typeof v === "string"));
    }
  };

  const handleRemove = (valueToRemove: string) => {
    if (isSingle) {
      onValueChange?.("");
    } else {
      const newValue = normalizedValue.filter((item) => item !== valueToRemove);
      onValueChange?.(newValue.filter((v): v is string => typeof v === "string"));
    }
  };

  const getDisplayText = () => {
    if (!normalizedValue.length) return placeholder;

    if (isSingle) {
      const option = options.find((opt) => opt.value === normalizedValue[0]);
      return option?.label;
    }

    if (normalizedValue.length <= maxDisplay) {
      return normalizedValue
        .map((val) => {
          const option = options.find((opt) => opt.value === val);
          return option?.label || val;
        })
        .join(", ");
    }

    return `${normalizedValue.length} items selected`;
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between min-h-10 flex-row",
              !normalizedValue.length && "text-muted-foreground",
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 text-left">
              {isSingle ? (
                normalizedValue.length > 0 ? (
                  <Badge key={normalizedValue[0]} variant="secondary" className="text-xs">
                    {getDisplayText()}
                  </Badge>
                ) : (
                  <span>{placeholder}</span>
                )
              ) : normalizedValue.length <= maxDisplay ? (
                normalizedValue.length > 0 ? (
                  normalizedValue.map((val) => {
                    const option = options.find((opt) => opt.value === val);
                    return (
                      <Badge key={val} variant="secondary" className="text-xs">
                        {option?.label || val}
                      </Badge>
                    );
                  })
                ) : (
                  <span>{placeholder}</span>
                )
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {normalizedValue.length} items selected
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = normalizedValue.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
                      <Check
                        className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected items display */}
      {normalizedValue.length > 0 && !isSingle && (
        <div className="flex flex-wrap gap-2 mt-2">
          {normalizedValue
            .filter((val): val is string => typeof val === "string")
            .map((val) => {
              const option = options.find((opt) => opt.value === val);
              return (
                <Badge key={val} variant="secondary" className="text-xs flex items-center gap-1">
                  {option?.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemove(val)}
                  />
                </Badge>
              );
            })}
        </div>
      )}
    </div>
  );
}
