import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BothThemes } from "../stories/BothThemes";
import { Checkbox } from "./checkbox";
import { Combobox } from "./combobox";
import { Field } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const meta = { title: "Primitives/Form controls" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Controls() {
  const [gateway, setGateway] = useState<string | null>("gw-eu-west-1");
  return (
    <div className="flex max-w-(--av-size-form-max) flex-col gap-4">
      <Field label="Server name" help="Shown to employees in the portal.">
        <Input placeholder="salesforce-crm" />
      </Field>
      <Field label="Endpoint URL" error="Use an https:// address.">
        <Input mono defaultValue="http://crm.internal/mcp" />
      </Field>
      <Field label="Description" optional>
        <Textarea placeholder="What this server is for" />
      </Field>
      <Field label="Transport">
        <Select defaultValue="http">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="http">Streamable HTTP</SelectItem>
            <SelectItem value="sse">Server-sent events</SelectItem>
            <SelectItem value="stdio">Standard input/output</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Gateway">
        <Combobox
          mono
          options={[
            { value: "gw-eu-west-1", label: "gw-eu-west-1" },
            { value: "gw-us-east-2", label: "gw-us-east-2" },
          ]}
          value={gateway}
          onValueChange={setGateway}
          placeholder="Choose a gateway"
          searchPlaceholder="Search gateways"
          emptyText="No gateways"
        />
      </Field>
      <Field label="Disabled" help="Read only for your role.">
        <Input disabled defaultValue="Managed by policy" />
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id="cb" defaultChecked />
        <Label htmlFor="cb">Require approval for new tools</Label>
      </div>
      <RadioGroup defaultValue="pin" aria-label="When the definition changes">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pin" id="r1" />
          <Label htmlFor="r1">Keep pinned version</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="hold" id="r2" />
          <Label htmlFor="r2">Hold calls until reviewed</Label>
        </div>
      </RadioGroup>
      <div className="flex items-center gap-2">
        <Switch id="sw" defaultChecked />
        <Label htmlFor="sw">Enabled</Label>
      </div>
    </div>
  );
}

export const AllControls: Story = { name: "All controls", render: () => <Controls /> };
export const BothThemesControls: Story = {
  name: "All controls (light and dark)",
  render: () => (
    <BothThemes>
      <Controls />
    </BothThemes>
  ),
};
