import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type NavbarItemDto, NavbarItemType, navbarService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ArrowDown, ArrowUp, Plus, Trash2, ChevronsUpDown, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ClientNavbarItem = {
  id?: number;
  _id: string;
  title: string;
  path?: string;
  type?: NavbarItemType;
  order?: number;
  parentId?: number;
  children?: ClientNavbarItem[];
};

export function NavbarBuilder() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<ClientNavbarItem[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const initClientItems = (data: NavbarItemDto[]): ClientNavbarItem[] => {
    return data.map((item) => ({
      ...item,
      _id: item.id ? String(item.id) : Math.random().toString(36).substring(2, 11),
      children: item.children ? initClientItems(item.children) : [],
    }));
  };

  const { isLoading: isNavbarLoading } = useQuery({
    queryKey: ["navbar"],
    queryFn: async () => {
      const data = await navbarService.getNavbar();
      setItems(initClientItems(data as unknown as NavbarItemDto[]));
      return data;
    },
  });

  const { data: availableRoutes = [] } = useQuery({
    queryKey: ["navbar-routes"],
    queryFn: async () => navbarService.getAvailableRoutes(),
  });

  const groupedRoutes = availableRoutes.reduce((acc, route) => {
    const groupName = route.group || "Other";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName]!.push(route);
    return acc;
  }, {} as Record<string, typeof availableRoutes>);

  const updateMutation = useMutation({
    mutationFn: (newItems: ClientNavbarItem[]) =>
      navbarService.bulkUpdate(newItems as unknown as NavbarItemDto[]),
    onSuccess: () => {
      toast.success("Navbar updated successfully");
      queryClient.invalidateQueries({ queryKey: ["navbar"] });
    },
    onError: () => {
      toast.error("Failed to update navbar");
    },
  });

  const handleSave = () => {
    updateMutation.mutate(items);
  };

  const handleAddTopLevel = () => {
    setItems([
      ...items,
      {
        _id: Math.random().toString(36).substring(2, 11),
        title: "New Item",
        path: "/",
        type: NavbarItemType.LINK,
        children: [],
      },
    ]);
  };

  const handleAddChild = (parentIndex: number) => {
    const newItems = [...items];
    const item = { ...newItems[parentIndex] } as ClientNavbarItem;
    if (!item.children) {
      item.children = [];
    }
    item.children = [
      ...item.children,
      {
        _id: Math.random().toString(36).substring(2, 11),
        title: "New Sub Item",
        path: "/",
        type: NavbarItemType.LINK,
      },
    ];
    newItems[parentIndex] = item;
    setItems(newItems);
  };

  const handleRemoveTopLevel = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    const newItems = [...items];
    const item = { ...newItems[parentIndex] } as ClientNavbarItem;
    if (item.children) {
      item.children = [...item.children];
      item.children.splice(childIndex, 1);
      newItems[parentIndex] = item;
      setItems(newItems);
    }
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    const updated = { ...newItems[index], [field]: value } as any;
    newItems[index] = updated;
    setItems(newItems);
  };

  const handleUpdateChildItem = (
    parentIndex: number,
    childIndex: number,
    field: string,
    value: string,
  ) => {
    const newItems = [...items];
    const parentItem = { ...newItems[parentIndex] } as ClientNavbarItem;
    if (parentItem.children) {
      const children = [...parentItem.children];
      const updated = { ...children[childIndex], [field]: value } as any;
      children[childIndex] = updated;
      parentItem.children = children;
      newItems[parentIndex] = parentItem;
      setItems(newItems);
    }
  };

  const handleMoveTopLevel = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      const item1 = newItems[index];
      const item2 = newItems[targetIndex];
      if (item1 && item2) {
        newItems[index] = item2;
        newItems[targetIndex] = item1;
        setItems(newItems);
      }
    }
  };

  const handleMoveChild = (parentIndex: number, childIndex: number, direction: "up" | "down") => {
    const newItems = [...items];
    const parent = { ...newItems[parentIndex] } as ClientNavbarItem;
    if (parent.children) {
      const children = [...parent.children];
      const targetIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
      if (targetIndex >= 0 && targetIndex < children.length) {
        const item1 = children[childIndex];
        const item2 = children[targetIndex];
        if (item1 && item2) {
          children[childIndex] = item2;
          children[targetIndex] = item1;
          parent.children = children;
          newItems[parentIndex] = parent;
          setItems(newItems);
        }
      }
    }
  };

  const renderItemEditor = (
    item: ClientNavbarItem,
    onUpdate: (field: string, val: string) => void,
    onRemove: () => void,
    onMoveUp: () => void,
    onMoveDown: () => void,
    isFirst: boolean,
    isLast: boolean,
    isChild: boolean,
  ) => (
    <div
      className={`flex items-start gap-3 bg-white p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${
        isChild ? "border-l-4 border-l-blue-400 ml-6" : "border-l-4 border-l-indigo-600"
      }`}
    >
      <div className="flex flex-col gap-1 mt-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveUp}
          disabled={isFirst}
          className="h-7 w-7 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveDown}
          disabled={isLast}
          className="h-7 w-7 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500">Title</Label>
            <Input
              value={item.title}
              onChange={(e) => onUpdate("title", e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500">Type</Label>
            <Select
              value={item.type || NavbarItemType.LINK}
              onValueChange={(val) => onUpdate("type", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200 hover:bg-white transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NavbarItemType.LINK}>Link</SelectItem>
                <SelectItem value={NavbarItemType.DYNAMIC_DESTINATIONS}>
                  Dynamic Destinations
                </SelectItem>
                <SelectItem value={NavbarItemType.DYNAMIC_TOURS}>Dynamic Tours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {(!item.type || item.type === NavbarItemType.LINK) && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500">Path / URL</Label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                value={item.path || ""}
                onChange={(e) => onUpdate("path", e.target.value)}
                placeholder="/example or https://google.com"
                className="pl-9 pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors font-mono text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <Popover
                  open={openPopoverId === item._id}
                  onOpenChange={(open) => setOpenPopoverId(open ? item._id : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 p-1.5 text-gray-400 hover:text-indigo-600">
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="p-0 w-[320px]">
                    <Command>
                      <CommandInput placeholder="Search routes..." />
                      <CommandList>
                        <CommandEmpty>No route found.</CommandEmpty>
                        {Object.entries(groupedRoutes).map(([group, routes]) => (
                          <CommandGroup key={group} heading={group}>
                            {routes.map((route, i) => (
                              <CommandItem
                                key={i}
                                value={`${route.label} ${route.path}`}
                                onSelect={() => {
                                  onUpdate("path", route.path);
                                  setOpenPopoverId(null);
                                }}
                                className="flex flex-col items-start cursor-pointer py-2"
                              >
                                <span className="font-medium text-sm">{route.label}</span>
                                <span className="text-xs text-gray-500 font-mono mt-0.5">{route.path}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 mt-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (isNavbarLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 max-w-2xl">
            Design your public site's navigation hierarchy by adding and ordering menu items. Select special integration types to link dynamically generated pages.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg shrink-0"
        >
          {updateMutation.isPending ? "Saving..." : "Save Navigation"}
        </Button>
      </div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {items.map((item, parentIndex) => (
              <div
                key={item._id}
                className="space-y-3 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-200"
              >
                {renderItemEditor(
                  item,
                  (f, v) => handleUpdateItem(parentIndex, f, v),
                  () => handleRemoveTopLevel(parentIndex),
                  () => handleMoveTopLevel(parentIndex, "up"),
                  () => handleMoveTopLevel(parentIndex, "down"),
                  parentIndex === 0,
                  parentIndex === items.length - 1,
                  false,
                )}

                {/* Children Loop */}
                <div className="pl-4 sm:pl-12 space-y-3 pt-2">
                  {item.children?.map((child, childIndex) => (
                    <div
                      key={child._id}
                      className="animate-in slide-in-from-top-2 fade-in duration-200 group"
                    >
                      {renderItemEditor(
                        child,
                        (f, v) => handleUpdateChildItem(parentIndex, childIndex, f, v),
                        () => handleRemoveChild(parentIndex, childIndex),
                        () => handleMoveChild(parentIndex, childIndex, "up"),
                        () => handleMoveChild(parentIndex, childIndex, "down"),
                        childIndex === 0,
                        childIndex === (item.children?.length ?? 0) - 1,
                        true,
                      )}
                    </div>
                  ))}

                  {/* Only allow children if it's a LINK type */}
                  {(!item.type || item.type === NavbarItemType.LINK) && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddChild(parentIndex)}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 rounded-full px-4 shrink-0 transition-colors bg-white font-medium shadow-sm"
                      >
                        <Plus className="h-4 w-4 mr-1.5" /> Add Sub Item
                      </Button>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600 py-8 rounded-2xl transition-colors hover:text-indigo-600 hover:border-indigo-300 shadow-sm"
              onClick={handleAddTopLevel}
            >
              <Plus className="h-5 w-5 mr-2" /> Add Main Menu Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
