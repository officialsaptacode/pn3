"use client";

import React from "react";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  ImageIcon, 
  Table as TableIcon,
  Columns as ColumnsIcon,
  Info,
  Text,
  Youtube
} from "lucide-react";
import { CommandList } from "./CommandList";

export const suggestion = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: "Text",
        description: "Just start typing with plain text.",
        icon: <Text className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
        },
      },
      {
        title: "Heading 1",
        description: "Big section heading.",
        icon: <Heading1 className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        description: "Medium section heading.",
        icon: <Heading2 className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small section heading.",
        icon: <Heading3 className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Create a simple bulleted list.",
        icon: <List className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a list with numbering.",
        icon: <ListOrdered className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Quote",
        description: "Capture a quotation.",
        icon: <Quote className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: "Table",
        description: "Insert a simple table.",
        icon: <TableIcon className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        },
      },
      {
        title: "Image",
        description: "Insert from Media Library.",
        icon: <ImageIcon className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).run();
          // We will trigger Media Manager here later
        },
      },
      {
        title: "YouTube",
        description: "Embed a video.",
        icon: <Youtube className="w-5 h-5" />,
        command: ({ editor, range }: any) => {
          const url = prompt("YouTube URL");
          if (url) {
            editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
          }
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
