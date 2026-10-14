import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/mini";
import { useTranslation } from "react-i18next";
import { Button, Field, InlineAlert, Input } from "@agentvault/ui";
import { AuthCard } from "./AuthLayout";
import { useStartSso } from "./SignInPage";

/** SH-01: SAML / home-realm discovery. The work email decides which identity provider to use. */
export function SamlPage({ redirect }: { redirect: string | undefined }) {
  const { t } = useTranslation("app");
  const sso = useStartSso(redirect);
  const alertRef = useRef<HTMLDivElement>(null);
  const schema = z.object({ email: z.string().check(z.trim(), z.email(t("auth.errors.emailInvalid"))) });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  useEffect(() => {
    if (sso.error) alertRef.current?.focus();
  }, [sso.error]);

  return (
    <AuthCard title={t("auth.saml.title")} lead={t("auth.saml.lead")}>
      {sso.error && (
        <InlineAlert ref={alertRef} tone="danger" title={t("auth.saml.notConfigured")}>
          {t("auth.saml.notConfiguredBody")}
        </InlineAlert>
      )}
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(e) => void form.handleSubmit((v) => sso.start({ email: v.email }, v.email.split("@")[1] ?? v.email))(e)}
      >
        <Field label={t("auth.saml.email")} error={form.formState.errors.email?.message}>
          <Input type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} {...form.register("email")} />
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={sso.pending !== null}>
          {t("auth.saml.submit")}
        </Button>
      </form>
      <Link to="/login" search={redirect ? { redirect } : {}} className="text-body-sm text-link hover:text-link-hover hover:underline">
        {t("auth.backToSignIn")}
      </Link>
    </AuthCard>
  );
}
