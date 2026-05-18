import { Button } from "@workspace/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/dialog";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { Label } from "recharts";

interface AddReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (review: { name: string; rating: number; comment: string }) => void;
}

const AddReviewModal = ({ open, onOpenChange, onAdd }: AddReviewModalProps) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) return;
    onAdd?.({ name: name.trim(), rating, comment: comment.trim() });
    setName("");
    setRating(5);
    setComment("");
    onOpenChange(false);
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
          <DialogDescription>Add a new review for the trek.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-[300px_1fr] items-center gap-2">
            <Label className="font-semibold">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="" />
          </div>

          <div className="grid grid-cols-[300px_1fr] items-center gap-2">
            <Label className="font-semibold">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 cursor-pointer transition-colors ${
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[300px_1fr] items-start gap-2">
            <Label className="font-semibold pt-2">Comment</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Add Review</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;
