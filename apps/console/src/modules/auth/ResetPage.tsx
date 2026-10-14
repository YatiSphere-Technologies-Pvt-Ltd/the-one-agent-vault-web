import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/mini";
import { useTranslation } from "react-i18next";
import { Button, Field, InlineAlert, Input } from "@agentvault/ui";
import { api } from "../../api";
import { AuthCard } from "./AuthLayout";

/** Password reset request. The answer never reveals whether an account exists. */
export function ResetPage({ redirect }: { redirect: string | undefined }) {
  const { t } = useTranslation("app");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const schema = z.object({ email: z.string().check(z.trim(), z.email(t("auth.errors.emailInvalid"))) });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  return (
    <AuthCard title={t("auth.reset.title")} lead={sentTo ? undefined : t("auth.reset.lead")}>
      {sentTo ? (
        <InlineAlert tone="success" title={t("auth.reset.sentTitle")}>
          {t("auth.reset.sentBody", { email: sentTo })}
        </InlineAlert>
      ) : (
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={(e) =>
            void form.handleSubmit(async (v) => {
              await api.POST("/api/auth/password-reset", { body: { email: v.email } });
              setSentTo(v.email);
            })(e)
          }
        >
          <Field label={t("auth.reset.email")} error={form.formState.errors.email?.message}>
            <Input type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} {...form.register("email")} />
          </Field>
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={form.formState.isSubmitting}>
            {t("auth.reset.submit")}
          </Button>
        </form>
      )}
      <Link to="/login" search={redirect ? { redirect } : {}} className="text-body-sm text-link hover:text-link-hover hover:underline">
        {t("auth.backToSignIn")}
      </Link>
    </AuthCard>
  );
}
