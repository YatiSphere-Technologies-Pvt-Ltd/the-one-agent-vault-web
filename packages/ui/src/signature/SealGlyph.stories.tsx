import type { Meta, StoryObj } from "@storybook/react-vite";
import { BothThemes } from "../stories/BothThemes";
import { SealGlyph, type SealSize, type SealState } from "./SealGlyph";

export const sampleHashes = [
  "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a",
  "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6c8e0f1d3b5a7c9e2f4d6b8a0c1e3d5f7",
  "sha256:0a1b2c3d4e5f60718293a4b5c6d7e8f9012345678",
  "sha256:ffffeeeeddddccccbbbbaaaa99998888",
  "sha256:5ea1a6e17c0de4b9f2c41d07a3e8b6f9c2d5e81a",
  "sha256:7d3f9a21c4b8e6f0a2d5c7e9b1f3a5c7d9e1f3b5",
  "sha256:c0ffee1234567890abcdef0123456789abcdef01",
  "sha256:1234567890abcdef1234567890abcdef12345678",
];
const states: SealState[] = ["intact", "broken", "pending", "revoked"];
const sizes: SealSize[] = ["xs", "sm", "md", "lg", "xl"];

const meta = {
  title: "Signature/SealGlyph",
  component: SealGlyph,
  args: { hash: sampleHashes[0] ?? "", state: "intact", size: "xl", label: "Seal intact: definition matches pinned version 4" },
  argTypes: {
    state: { control: "inline-radio", options: states },
    size: { control: "inline-radio", options: sizes },
  },
} satisfies Meta<typeof SealGlyph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function Grid() {
  return (
    <div className="flex flex-col gap-6">
      {states.map((state) => (
        <section key={state} aria-label={state} className="flex flex-col gap-2">
          <h3 className="m-0 text-label text-ink-muted">{state}</h3>
          {sizes.map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="w-8 font-mono text-mono-sm text-ink-muted">{size}</span>
              {sampleHashes.map((hash) => (
                <SealGlyph key={hash} hash={hash} state={state} size={size} label={`Seal ${state}, ${size}`} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/** 8 sample hashes × 4 states × 5 sizes, light and dark. */
export const GridBothThemes: Story = {
  name: "Grid (light and dark)",
  render: () => (
    <BothThemes>
      <Grid />
    </BothThemes>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {states.map((state) => (
        <SealGlyph key={state} {...args} state={state} label={`Seal ${state}`} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      {sizes.map((size) => (
        <SealGlyph key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
