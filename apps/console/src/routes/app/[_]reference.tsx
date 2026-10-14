import { createFileRoute } from "@tanstack/react-router";
import { ReferencePage } from "../../modules/reference/ReferencePage";

/** /app/_reference: the visual benchmark page. */
export const Route = createFileRoute("/app/_reference")({
  component: ReferencePage,
});
