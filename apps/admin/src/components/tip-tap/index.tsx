"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { CharacterCount } from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import YouTube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

import { SlashCommand } from "./extensions/SlashCommand";
import { suggestion } from "./components/suggestions";
import { LineHeight } from "./extensions/LineHeight";
import { Toolbar } from "./components/Toolbar";
import { BubbleMenu } from "./components/BubbleMenu";

import "./styles/editor.css";

interface TiptapProps {
  onChange: (richText: string) => void;
  value?: string;
}

export default function Tiptap({ onChange, value }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      CharacterCount.configure({
        limit: 50000,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      YouTube.configure({
        width: 640,
        height: 480,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg border shadow-sm",
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return "Press '/' for commands...";
        },
      }),
      LineHeight,
      SlashCommand.configure({
        suggestion,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full rounded-xl border bg-background shadow-sm overflow-hidden flex flex-col">
      <Toolbar editor={editor} />
      {editor && <BubbleMenu editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between items-center px-4 py-2 border-t text-[10px] text-muted-foreground uppercase tracking-widest font-bold bg-muted/30">
        <div>
          {editor.storage.characterCount.words()} Words
        </div>
        <div>
          {editor.storage.characterCount.characters()} Characters
        </div>
      </div>
    </div>
  );
}
