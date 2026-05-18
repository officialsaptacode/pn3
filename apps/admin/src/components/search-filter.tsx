import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface SearchFilterProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  value?: string;
}

export function SearchFilter({
  searchPlaceholder = "Search...",
  onSearchChange,
  filterOptions,
  onFilterChange,
  filterPlaceholder = "Filter",
  value,
}: SearchFilterProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Input
        placeholder={searchPlaceholder}
        className="max-w-sm"
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
      {filterOptions && (
        <Select onValueChange={onFilterChange} value={value}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
