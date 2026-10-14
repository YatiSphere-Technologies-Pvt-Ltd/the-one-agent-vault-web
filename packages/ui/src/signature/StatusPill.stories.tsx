import type { Meta, StoryObj } from "@storybook/react-vite";
import { BothThemes } from "../stories/BothThemes";
import { StatusVocabulary, statusTone, type StatusTone } from "../status";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Signature/StatusPill",
  component: StatusPill,
  args: { status: StatusVocabulary.Approved },
  argTypes: { status: { control: "select", options: Object.values(StatusVocabulary) } },
} satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const tones: StatusTone[] = ["success", "info", "held", "danger", "neutral"];

function Vocabulary() {
  return (
    <div className="flex flex-col gap-3">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-caption text-ink-muted">{tone}</span>
          {Object.values(StatusVocabulary)
            .filter((s) => statusTone[s] === tone)
            .map((s) => (
              <StatusPill key={s} status={s} />
            ))}
        </div>
      ))}
    </div>
  );
}

export const AllStatuses: Story = {
  name: "Vocabulary (light and dark)",
  render: () => (
    <BothThemes>
      <Vocabulary />
    </BothThemes>
  ),
};
