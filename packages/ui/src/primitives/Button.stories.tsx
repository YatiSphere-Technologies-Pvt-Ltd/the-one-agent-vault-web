import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";
import { BothThemes } from "../stories/BothThemes";
import { Button } from "./button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Review the change", variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const variants = ["primary", "secondary", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

export const Matrix: Story = {
  name: "Variants × sizes (light and dark)",
  render: () => (
    <BothThemes>
      <div className="flex flex-col gap-3">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant} {size}
              </Button>
            ))}
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} loading>
              Loading keeps width
            </Button>
            <Button variant={variant} iconOnly aria-label="Add">
              <Plus aria-hidden />
            </Button>
          </div>
        ))}
      </div>
    </BothThemes>
  ),
};

export const WithIcon: Story = {
  args: {
    variant: "danger",
    children: (
      <>
        <Trash2 aria-hidden /> Delete server
      </>
    ),
  },
};
export const Loading: Story = { args: { loading: true } };
