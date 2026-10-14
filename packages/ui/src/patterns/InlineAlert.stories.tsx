import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "./InlineAlert";

const meta = { title: "Patterns/InlineAlert", component: InlineAlert, args: { tone: "danger" } } satisfies Meta<typeof InlineAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllTones: Story = {
  render: () => (
    <div className="flex max-w-(--av-size-dialog) flex-col gap-3">
      <InlineAlert tone="danger" title="Email or password is incorrect">Check them and try again.</InlineAlert>
      <InlineAlert tone="held" title="Account locked">Try again in 15 minutes or reset your password.</InlineAlert>
      <InlineAlert tone="info">Demo: use the sample account shown below.</InlineAlert>
      <InlineAlert tone="success" title="Check your email" />
    </div>
  ),
};
