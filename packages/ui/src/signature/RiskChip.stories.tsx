import type { Meta, StoryObj } from "@storybook/react-vite";
import { BothThemes } from "../stories/BothThemes";
import { RiskChip } from "./RiskChip";

const meta = {
  title: "Signature/RiskChip",
  component: RiskChip,
  args: { score: 62 },
  argTypes: { score: { control: { type: "range", min: 0, max: 100 } } },
} satisfies Meta<typeof RiskChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Levels: Story = {
  name: "Levels and boundaries (light and dark)",
  render: () => (
    <BothThemes>
      <div className="flex flex-wrap gap-2">
        {[0, 24, 25, 49, 50, 74, 75, 100].map((score) => (
          <RiskChip key={score} score={score} />
        ))}
      </div>
    </BothThemes>
  ),
};
