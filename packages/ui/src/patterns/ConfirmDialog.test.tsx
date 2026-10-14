import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog, type ConfirmTier } from "./ConfirmDialog";
import { Toaster } from "../primitives/sonner";
import { ThemeProvider } from "../theme/ThemeProvider";

function Harness({ tier, onConfirm, onUndo }: { tier: ConfirmTier; onConfirm: () => void; onUndo?: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <ThemeProvider defaultPreference="light">
      <ConfirmDialog
        tier={tier}
        open={open}
        onOpenChange={setOpen}
        title="Disable salesforce-crm?"
        actionLabel="Disable server"
        impact={<p>All users lose access.</p>}
        objectName="salesforce-crm"
        onConfirm={onConfirm}
        {...(onUndo ? { onUndo } : {})}
      />
      <Toaster />
    </ThemeProvider>
  );
}

describe("ConfirmDialog", () => {
  it("tier 0 acts at once and offers Undo in a toast instead of a dialog", async () => {
    const onConfirm = vi.fn();
    const onUndo = vi.fn();
    render(<Harness tier={0} onConfirm={onConfirm} onUndo={onUndo} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    const undo = await screen.findByRole("button", { name: "Undo" });
    await userEvent.click(undo);
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("tier 1 shows the impact summary and confirms directly", async () => {
    const onConfirm = vi.fn();
    render(<Harness tier={1} onConfirm={onConfirm} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("All users lose access.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Reason")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Disable server" }));
    expect(onConfirm).toHaveBeenCalledWith({});
  });

  it("tier 2 needs a reason and the typed object name before the button enables", async () => {
    const onConfirm = vi.fn();
    render(<Harness tier={2} onConfirm={onConfirm} />);
    const button = screen.getByRole("button", { name: "Disable server" });
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Reason"), "Definition changed upstream");
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Type salesforce-crm to confirm"), "salesforce-cr");
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Type salesforce-crm to confirm"), "m");
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(onConfirm).toHaveBeenCalledWith({ reason: "Definition changed upstream" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("tier 3 saves a proposal for a second administrator", async () => {
    const onConfirm = vi.fn();
    render(<Harness tier={3} onConfirm={onConfirm} />);
    expect(screen.getByText(/second administrator must approve/i)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Reason"), "Quarterly review");
    await userEvent.type(screen.getByLabelText("Type salesforce-crm to confirm"), "salesforce-crm");
    await userEvent.click(screen.getByRole("button", { name: "Save as proposal" }));
    expect(onConfirm).toHaveBeenCalledWith({ reason: "Quarterly review", proposal: true });
  });
});
