import type { Meta, StoryObj } from "@storybook/react-vite";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ScrollArea } from "./scroll-area";

const meta = { title: "Primitives/Data and layout" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const UnderlineTabs: Story = {
  name: "Tabs",
  render: () => (
    <Tabs defaultValue="tools">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="versions">Versions</TabsTrigger>
      </TabsList>
      <TabsContent value="tools">Tools panel</TabsContent>
    </Tabs>
  ),
};

const rows = [
  ["create_record", "62", "Modified"],
  ["export_report", "78", "Requires approval"],
  ["update_opportunity", "41", "Modified"],
];

export const BasicTable: Story = {
  name: "Table (comfortable and compact)",
  render: () => (
    <div className="flex flex-col gap-6">
      {(["comfortable", "compact"] as const).map((density) => (
        <Table key={density} density={density}>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(([tool, risk, status], i) => (
              <TableRow key={tool} data-state={i === 1 ? "selected" : undefined}>
                <TableCell className="font-mono text-mono">{tool}</TableCell>
                <TableCell>{risk}</TableCell>
                <TableCell>{status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  ),
};

export const CommandList_: Story = {
  name: "Command",
  render: () => (
    <Command className="max-w-md rounded-overlay border border-edge">
      <CommandInput placeholder="Type a page name" aria-label="Search" />
      <CommandList>
        <CommandEmpty>No matching pages</CommandEmpty>
        <CommandGroup heading="Console">
          <CommandItem>Servers</CommandItem>
          <CommandItem>Skills</CommandItem>
          <CommandItem>Review queue</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const SkeletonSeparatorScroll: Story = {
  name: "Skeleton, separator, scroll area",
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-(--av-size-row-comfortable)" />
      <Separator />
      <ScrollArea className="h-32 rounded-panel border border-edge">
        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="m-0">
              Line {i + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
