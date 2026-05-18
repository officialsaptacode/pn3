"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-xl border bg-background p-2 shadow-2xl backdrop-blur-sm"
      >
        {props.items.length > 0 ? (
          props.items.map((item: any, index: number) => (
            <button
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              }`}
              key={index}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              type="button"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold leading-none">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

CommandList.displayName = "CommandList";
