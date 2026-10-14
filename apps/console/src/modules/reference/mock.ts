// Mock data for the reference page (/app/_reference). Server-provided text is untrusted.
import { StatusVocabulary } from "@agentvault/ui";

export const pinned = {
  hash: "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a",
  version: 4,
  approvedAt: "2026-09-28T14:12:00Z",
  approvedBy: "Amara Okafor",
  toolCount: 12,
};

export const served = {
  hash: "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6c8e0f1d3b5a7c9e2f4d6b8a0c1e3d5f7",
  seenAt: "2026-10-14T08:41:00Z",
  gateway: "gw-eu-west-1",
  changedCount: 3,
};

export interface ChangedTool {
  name: string;
  /** Untrusted: comes from the server's definition. */
  change: string;
  risk: number;
  status: StatusVocabulary;
}

export const changedTools: ChangedTool[] = [
  {
    name: "create_record",
    change: "Description changed.\nNew parameter: owner_id",
    risk: 62,
    status: StatusVocabulary.Modified,
  },
  {
    name: "export_report",
    change: "New tool, not in pinned version 4",
    risk: 78,
    status: StatusVocabulary.RequiresApproval,
  },
  {
    name: "update_opportunity",
    change: "Input schema widened: amount now accepts strings",
    risk: 41,
    status: StatusVocabulary.Modified,
  },
];

export const strips = [
  {
    id: "held-1",
    state: "person" as const,
    time: "12 min",
    timeNote: "waiting",
    who: { name: "Jonah Fischer", client: "Sales ops agent" },
    tool: "create_record",
    why: "Definition changed after approval. The call is held until a person decides.",
  },
  {
    id: "held-2",
    state: "person" as const,
    time: "34 min",
    timeNote: "waiting",
    who: { name: "Lena Park", client: "Claude Desktop" },
    tool: "update_opportunity",
    why: "Definition changed after approval. The call is held until a person decides.",
  },
  {
    id: "held-3",
    state: "policy" as const,
    time: "2 h",
    timeNote: "held",
    who: { name: "Pipeline sync", client: "Service account" },
    tool: "export_report",
    why: "Policy: no bulk export from CRM servers without approval.",
  },
];
