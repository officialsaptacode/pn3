import type { Media } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Check, Trash2 } from "lucide-react";

interface MediaGridProps {
  media: Media[];
  selectedIds: number[];
  onSelect: (media: Media) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export function MediaGrid({ media, selectedIds, onSelect, onDelete, isLoading }: MediaGridProps) {
  const isSelected = (id: number) => selectedIds.includes(id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2md:grid-cols-4 gap-4 p-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted rounded-md" />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p>No media found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {media.map((item) => (
        <div
          key={item.id}
          className={`group relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
            isSelected(item.id)
              ? "border-primary ring-2 ring-primary/50"
              : "border-transparent hover:border-muted-foreground/50"
          }`}
          onClick={() => onSelect(item)}
        >
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.altText || item.caption || item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay for selection status */}
          {isSelected(item.id) && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
            <p className="text-white text-xs truncate font-medium">{item.filename}</p>
            {item.caption && <p className="text-white/80 text-xs truncate">{item.caption}</p>}

            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
