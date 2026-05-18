import { Button } from "@workspace/ui/components/button";
import { FileIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface BulkUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading?: boolean;
}

export function BulkUpload({ onUpload, isUploading }: BulkUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    await onUpload(files);
    setFiles([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex-1 border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleChange}
          className="hidden"
          id="media-upload-input"
          disabled={isUploading}
        />
        <label
          htmlFor="media-upload-input"
          className="cursor-pointer flex flex-col items-center justify-center h-full"
        >
          <div className="bg-muted rounded-full p-4 mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 10MB)</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Selected Files ({files.length})</h4>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])} disabled={isUploading}>
              Clear all
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-background rounded p-1">
                    <FileIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm truncate font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleUpload} disabled={isUploading} className="w-full" size="lg">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading {files.length} files...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} files
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
