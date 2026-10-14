import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../primitives/button";
import { BothThemes } from "../stories/BothThemes";
import { Strip, StripList, type StripState } from "./Strip";

const meta = {
  title: "Signature/Strip",
  component: Strip,
  args: {
    state: "person",
    time: "12 min",
    timeNote: "waiting",
    who: <span className="text-label">Jonah Fischer</span>,
    what: <code className="font-mono text-mono">create_record</code>,
    why: "Definition changed after approval. The call is held until a person decides.",
  },
  decorators: [
    (Story) => (
      <ul className="m-0 list-none p-0">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof Strip>;
export default meta;
type Story = StoryObj<typeof meta>;

const actions = (
  <>
    <Button size="lg">Deny</Button>
    <Button size="lg" variant="primary">
      Approve
    </Button>
  </>
);

export const Person: Story = { args: { actions } };
export const Policy: Story = { args: { state: "policy", time: "2 h", timeNote: "held", actions: <Button size="lg">Open</Button> } };
export const Approved: Story = { args: { state: "approved", time: "09:12", timeNote: "approved" } };
export const Closed: Story = { args: { state: "closed", time: "Yesterday", timeNote: "closed" } };

const all: StripState[] = ["person", "policy", "approved", "closed"];
export const AllStates: Story = {
  name: "List, all states (light and dark)",
  decorators: [(Story) => <Story />],
  render: (args) => (
    <BothThemes>
      <StripList heading="Held calls and approvals">
        {all.map((state) => (
          <Strip key={state} {...args} state={state} actions={state === "person" ? actions : undefined} />
        ))}
      </StripList>
    </BothThemes>
  ),
};
