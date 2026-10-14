import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { notify } from "./sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = { title: "Primitives/Overlays" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DialogConfirm: Story = {
  name: "Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keep pinned version?</DialogTitle>
          <DialogDescription>Calls keep using version 4 until someone reviews the change.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Cancel</Button>
          <Button variant="primary">Keep pinned version</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Drawer: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Open drawer</Button>
        </SheetTrigger>
        <SheetContent width="wide">
          <SheetHeader>
            <SheetTitle>Call detail</SheetTitle>
            <SheetDescription>call-9001 · create_record</SheetDescription>
          </SheetHeader>
          <SheetBody>Drawer body.</SheetBody>
        </SheetContent>
      </Sheet>
    );
  },
};

export const Menu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Export diff</DropdownMenuItem>
        <DropdownMenuItem>Copy server ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Disable server</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const PopoverAndTooltip: Story = {
  name: "Popover and tooltip",
  render: () => (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>Popover content on a raised surface.</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover for tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>Supplementary only</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Toasts: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button onClick={() => notify.success("Server enabled")}>Success (6 s)</Button>
      <Button onClick={() => notify.success("Server disabled", { onUndo: () => undefined })}>With undo (10 s)</Button>
      <Button onClick={() => notify.error("Could not reach gw-eu-west-1")}>Error (persists)</Button>
    </div>
  ),
};
