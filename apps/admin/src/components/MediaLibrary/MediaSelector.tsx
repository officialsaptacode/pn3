import type { Media } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { MediaLibraryModal } from "./MediaLibraryModal";

interface MediaSelectorProps {
  value?: Media | Media[];
  onChange: (media: Media | Media[] | undefined) => void;
  maxSelect?: number;
  className?: string;
  triggerLabel?: string;
}

export function MediaSelector({
  value,
  onChange,
  maxSelect = 1,
  className,
  triggerLabel = "Select Image",
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false);

  const selected: Media[] = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (media: Media[]) => {
    if (maxSelect === 1) {
      onChange(media[0]);
    } else {
      onChange(media);
    }
  };

  const _clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const removeMedia = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (Array.isArray(value)) {
      onChange(value.filter((m) => m.id !== id));
    } else {
      onChange(undefined);
    }
  };

  return (
    <>
      <MediaLibraryModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelect}
        maxSelect={maxSelect}
        defaultSelected={selected}
      />

      <div className={className}>
        {selected.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {selected.map((item) => (
              <div
                key={item.id}
                className="relative group aspect-video h-40 rounded-lg border overflow-hidden bg-muted"
              >
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.altText || "Selected media"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => removeMedia(e, item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {maxSelect > 1 && selected.length < maxSelect && (
              <Button
                type="button"
                variant="outline"
                className="h-40 w-40 border-dashed"
                onClick={() => setOpen(true)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Add More
              </Button>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full h-32 border-dashed flex flex-col gap-2"
            onClick={() => setOpen(true)}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground">{triggerLabel}</span>
          </Button>
        )}
      </div>
    </>
  );
}
