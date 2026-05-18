"use client";

import React from "react";
import { BubbleMenu as TiptapBubbleMenu, type Editor } from "@tiptap/react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Highlighter
} from "lucide-react";
import { Toggle } from "@workspace/ui/components/toggle";

export const BubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <TiptapBubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      className="flex items-center space-x-1 rounded-lg border bg-background p-1 shadow-xl backdrop-blur-md"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Toggle>
    </TiptapBubbleMenu>
  );
};
