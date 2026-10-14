import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";
import { useTranslation } from "react-i18next";
import {
  Button,
  PageHeader,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@agentvault/ui";
import { NotBuilt, ScreenMeta } from "../../../modules/screens/ScreenPlaceholder";

const search = z.object({ request: z.catch(z.optional(z.literal(1)), undefined) });

/** PT-02 portal item detail; PT-03 request access is a drawer on ?request=1. */
export const Route = createFileRoute("/portal/skills/$id")({
  staticData: { screenId: "PT-02" },
  validateSearch: search,
  component: PortalItem,
});

function PortalItem() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  const { request } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="flex flex-col gap-6" data-screen="PT-02">
      <PageHeader
        breadcrumbs={[{ label: t("screens.PT-01"), link: { to: "/portal" } }, { label: id }]}
        title={t("screens.PT-02")}
        meta={<ScreenMeta id="PT-02" />}
        primaryAction={
          <Button variant="primary" onClick={() => void navigate({ search: { request: 1 as const } })}>
            {t("screens.PT-03")}
          </Button>
        }
      />
      <NotBuilt id="PT-02" />
      <Sheet
        open={request === 1}
        onOpenChange={(open) => {
          if (!open) void navigate({ search: {} });
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("screens.PT-03")}</SheetTitle>
            <SheetDescription>
              <ScreenMeta id="PT-03" />
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <NotBuilt id="PT-03" />
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}
