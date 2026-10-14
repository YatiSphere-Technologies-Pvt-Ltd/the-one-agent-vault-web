import type { Meta, StoryObj } from "@storybook/react-vite";
import { BothThemes } from "../stories/BothThemes";
import { SealCompare } from "./SealCompare";

const pinned = {
  hash: "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a",
  version: 4,
  approvedAt: "2026-09-28T14:12:00Z",
  approvedBy: "Amara Okafor",
  toolCount: 12,
};
const served = {
  hash: "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6c8e0f1d3b5a7c9e2f4d6b8a0c1e3d5f7",
  seenAt: "2026-10-14T08:41:00Z",
  gateway: "gw-eu-west-1",
  changedCount: 3,
};

const meta = {
  title: "Signature/SealCompare",
  component: SealCompare,
  args: { pinned, served },
} satisfies Meta<typeof SealCompare>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefinitionChanged: Story = {};
export const Matching: Story = { args: { served: null } };
export const BothThemesChanged: Story = {
  name: "Changed (light and dark)",
  render: (args) => (
    <BothThemes>
      <SealCompare {...args} />
    </BothThemes>
  ),
};
export const Narrow: Story = { globals: { viewport: { value: "mobile1" } } };
