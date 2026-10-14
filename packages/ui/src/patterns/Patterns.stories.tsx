import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { House, Server } from "lucide-react";
import { Button } from "../primitives/button";
import { StatusVocabulary } from "../status";
import { RiskChip } from "../signature/RiskChip";
import { StatusPill } from "../signature/StatusPill";
import { AppShell } from "./AppShell";
import { ConfirmDialog, type ConfirmTier } from "./ConfirmDialog";
import { DataTable, type DataTableColumn, type SortingState } from "./DataTable";
import { PageHeader } from "./PageHeader";
import { SafeText } from "./SafeText";
import { StateView } from "./StateView";

const meta = { title: "Patterns" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  name: "PageHeader",
  render: () => (
    <PageHeader
      breadcrumbs={[{ label: "MCP servers", link: { to: "/" } }, { label: "salesforce-crm" }]}
      title="salesforce-crm"
      meta="MC-03"
      seal={{ hash: "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6", state: "broken", label: "Seal broken" }}
      status={StatusVocabulary.HeldDefinitionChanged}
      risk={62}
      secondaryActions={<Button>Keep pinned version</Button>}
      primaryAction={<Button variant="primary">Review the change</Button>}
      overflow={[
        { id: "disable", label: "Disable server", destructive: true, onSelect: () => undefined },
        { id: "export", label: "Export diff", onSelect: () => undefined },
      ]}
    />
  ),
};

export const StateLoading: Story = { name: "StateView: loading", render: () => <StateView kind="loading" layout="table" /> };
export const StateEmpty: Story = {
  name: "StateView: empty",
  render: () => <StateView kind="empty" title="No servers yet" body="Add a server to start governing it." action={<Button variant="primary">Add server</Button>} />,
};
export const StateError: Story = {
  name: "StateView: error",
  render: () => <StateView kind="error" requestId="req_7f3a9c21" onRetry={() => undefined} />,
};
export const StateNoAccess: Story = { name: "StateView: no access", render: () => <StateView kind="no-access" owner="your workspace administrator" /> };
export const StatePartial: Story = {
  name: "StateView: partial",
  render: () => (
    <StateView kind="partial" message="Activity from gw-us-east-2 is missing.">
      <p className="m-0">Rest of the page.</p>
    </StateView>
  ),
};

interface Row {
  name: string;
  risk: number;
  status: StatusVocabulary;
}
const rows: Row[] = [
  { name: "create_record", risk: 62, status: StatusVocabulary.Modified },
  { name: "export_report", risk: 78, status: StatusVocabulary.RequiresApproval },
  { name: "update_opportunity", risk: 41, status: StatusVocabulary.Modified },
];
const columns: DataTableColumn<Row>[] = [
  { accessorKey: "name", header: "Tool", cell: (c) => <code className="font-mono text-mono">{c.row.original.name}</code> },
  { accessorKey: "risk", header: "Risk", cell: (c) => <RiskChip score={c.row.original.risk} /> },
  { accessorKey: "status", header: "Status", enableSorting: false, cell: (c) => <StatusPill status={c.row.original.status} /> },
];

export const Table: Story = {
  name: "DataTable",
  render: function Render() {
    const [sorting, setSorting] = useState<SortingState>([]);
    return (
      <DataTable
        id="story"
        caption="Changed tools"
        columns={columns}
        data={rows}
        getRowId={(r) => r.name}
        sorting={sorting}
        onSortingChange={setSorting}
        selectedRowId="export_report"
        rowActions={() => <Button size="sm" variant="ghost">Open</Button>}
      />
    );
  },
};
export const TableEmpty: Story = {
  name: "DataTable: empty and error rows",
  render: () => (
    <div className="flex flex-col gap-6">
      <DataTable id="empty" caption="Empty" columns={columns} data={[]} getRowId={(r) => r.name} />
      <DataTable id="error" caption="Error" columns={columns} data={[]} getRowId={(r) => r.name} status="error" />
      <DataTable id="loading" caption="Loading" columns={columns} data={[]} getRowId={(r) => r.name} status="loading" />
    </div>
  ),
};

function ConfirmDemo({ tier }: { tier: ConfirmTier }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Disable server (tier {tier})
      </Button>
      <ConfirmDialog
        tier={tier}
        open={open}
        onOpenChange={setOpen}
        title="Disable salesforce-crm?"
        actionLabel="Disable server"
        impact={<p className="m-0">All 214 users lose access. 3 agents are disconnected.</p>}
        objectName="salesforce-crm"
        onConfirm={() => undefined}
        onUndo={() => undefined}
      />
    </>
  );
}
export const Confirm: Story = {
  name: "ConfirmDialog tiers",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {([0, 1, 2, 3] as const).map((tier) => (
        <ConfirmDemo key={tier} tier={tier} />
      ))}
    </div>
  ),
};

export const Safe: Story = {
  name: "SafeText",
  render: () => <SafeText as="p" text={'Untrusted <img src=x onerror="alert(1)">\nSecond line is preserved.'} />,
};

export const Shell: Story = {
  name: "AppShell",
  render: () => (
    <AppShell
      nav={[
        { id: "home", label: "Home", icon: <House />, link: { to: "/" }, matchPaths: ["/"], exact: true },
        { id: "servers", label: "MCP servers", icon: <Server />, link: { to: "/" }, matchPaths: ["/servers"], waiting: true },
      ]}
      homeLink={{ to: "/" }}
      workspaces={[{ id: "a", name: "Default workspace" }]}
      workspaceId="a"
      onWorkspaceChange={() => undefined}
      onOpenSearch={() => undefined}
      unreadCount={3}
      notificationsPanel={<p className="m-0 p-4">No new notifications</p>}
      user={{ name: "Priya Raman", email: "priya.raman@example.com" }}
      profileLink={{ to: "/" }}
      switchLink={{ to: "/" }}
      switchLabel="Switch to portal"
      onSignOut={() => undefined}
    >
      <PageHeader title="Home" meta="SH-03" />
    </AppShell>
  ),
};
