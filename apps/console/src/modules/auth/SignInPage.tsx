import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/mini";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { identityProviderMarks } from "@agentvault/icons";
import { KeyRound } from "lucide-react";
import { Button, Checkbox, Field, InlineAlert, Input, Label, PasswordInput, Skeleton, storage } from "@agentvault/ui";
import { api } from "../../api";
import { DEMO_PASSWORD_HINT } from "./demo";
import { AuthCard, LAST_METHOD_KEY, SealVerified, verifiedPauseMs } from "./AuthLayout";
import { isMockAuth, safeRedirect, savePendingSso, sessionQueryOptions } from "./session";

type ProviderId = Schemas["AuthProvider"]["id"];

const providersQuery = {
  queryKey: ["auth", "providers"],
  queryFn: async () => {
    const { data } = await api.GET("/api/auth/providers");
    return data ?? { providers: [], passwordEnabled: true };
  },
  staleTime: Infinity,
  retry: false,
} as const;

/** Start single sign-on: ask the API where to go, remember the CSRF state, leave for the provider. */
export function useStartSso(redirect: string | undefined) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const start = async (body: { provider?: ProviderId; email?: string }, label: string) => {
    setError(null);
    setPending(label);
    const target = safeRedirect(redirect);
    const { data, error: problem } = await api.POST("/api/auth/sso/start", { body: { ...body, redirect: target } });
    if (!data) {
      setPending(null);
      setError(problem?.title ?? "error");
      return;
    }
    savePendingSso({ state: data.state, redirect: target, providerName: data.providerName ?? label });
    storage.set(LAST_METHOD_KEY, body.provider ?? "saml");
    window.location.assign(data.authorizeUrl);
  };
  return { start, pending, error };
}

/** The provider's own mark (official colours); a neutral monogram for providers without one. */
function ProviderMark({ id, name }: { id: ProviderId; name: string }) {
  const Mark = id in identityProviderMarks ? identityProviderMarks[id as keyof typeof identityProviderMarks] : null;
  return (
    <span aria-hidden className="inline-flex size-6 items-center justify-center">
      {Mark ? (
        <Mark width={20} height={20} />
      ) : (
        <span className="inline-flex size-6 items-center justify-center rounded-control border border-edge bg-sunken text-label font-semibold text-ink-secondary">
          {name.charAt(0)}
        </span>
      )}
    </span>
  );
}

/** SH-01: sign in with single sign-on or an AgentVault account. */
export function SignInPage({ redirect }: { redirect: string | undefined }) {
  const { t } = useTranslation("app");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const providers = useQuery(providersQuery);
  const sso = useStartSso(redirect);
  const [serverError, setServerError] = useState<{ title: string; detail?: string; locked: boolean } | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const [lastMethod] = useState(() => storage.get(LAST_METHOD_KEY));
  const [verified, setVerified] = useState<{ name: string; href: string } | null>(null);

  // Show the verified seal briefly, then continue.
  useEffect(() => {
    if (!verified) return;
    const timer = window.setTimeout(() => void navigate({ href: verified.href, replace: true }), verifiedPauseMs());
    return () => window.clearTimeout(timer);
  }, [verified, navigate]);

  const schema = z.object({
    username: z.string().check(z.trim(), z.minLength(1, t("auth.errors.usernameRequired"))),
    password: z.string().check(z.minLength(1, t("auth.errors.passwordRequired"))),
    remember: z.boolean(),
  });
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", remember: false },
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (serverError) alertRef.current?.focus();
  }, [serverError]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const { data, error, response } = await api.POST("/api/auth/login", { body: values });
    if (!data) {
      setServerError({
        title: error?.title ?? t("auth.errors.generic"),
        ...(error?.detail ? { detail: error.detail } : {}),
        locked: response.status === 423,
      });
      form.setValue("password", "");
      return;
    }
    storage.set(LAST_METHOD_KEY, "password");
    setVerified({ name: data.user.name, href: safeRedirect(redirect) });
    queryClient.setQueryData(sessionQueryOptions.queryKey, data);
  });

  const ssoProviders = providers.data?.providers.filter((p) => p.kind === "oidc") ?? [];
  const hasSaml = providers.data?.providers.some((p) => p.kind === "saml") ?? false;
  const busy = isSubmitting || sso.pending !== null;

  if (verified) {
    return (
      <SealVerified
        name={verified.name}
        destination={verified.href.startsWith("/app") ? t("auth.success.console") : t("auth.success.portal")}
      />
    );
  }

  const lastUsed = (
    <span className="rounded-pill border border-status-success-border bg-status-success-bg px-2 text-caption font-semibold text-status-success-fg">
      {t("auth.lastUsed")}
    </span>
  );

  return (
    <AuthCard title={t("auth.signIn.title")} lead={t("auth.signIn.lead")}>
      {(serverError || sso.error) && (
        <InlineAlert ref={alertRef} tone={serverError?.locked ? "held" : "danger"} title={serverError?.title ?? t("auth.errors.ssoStart")}>
          {serverError?.detail}
        </InlineAlert>
      )}

      <div className="flex flex-col gap-2">
        {providers.isPending ? (
          <>
            <Skeleton className="h-(--av-size-control-lg)" />
            <Skeleton className="h-(--av-size-control-lg)" />
            <Skeleton className="h-(--av-size-control-lg)" />
          </>
        ) : (
          ssoProviders.map((p) => (
            <Button
              key={p.id}
              size="lg"
              className="w-full justify-start [&>span]:w-full"
              disabled={busy}
              loading={sso.pending === p.name}
              onClick={() => void sso.start({ provider: p.id }, p.name)}
            >
              <ProviderMark id={p.id} name={p.name} />
              <span className="flex-1 text-start">{t("auth.signIn.continueWith", { provider: p.name })}</span>
              {lastMethod === p.id && lastUsed}
            </Button>
          ))
        )}
        {hasSaml && (
          <Button asChild size="lg" className="w-full justify-start">
            <Link to="/login/sso" search={redirect ? { redirect } : {}}>
              <span aria-hidden className="inline-flex size-6 items-center justify-center text-ink-secondary">
                <KeyRound className="size-5" />
              </span>
              <span className="flex-1 text-start">{t("auth.signIn.saml")}</span>
              {lastMethod === "saml" && lastUsed}
            </Link>
          </Button>
        )}
        {sso.pending && (
          <p role="status" className="m-0 text-center text-body-sm text-ink-muted">
            {t("auth.signIn.redirecting", { provider: sso.pending })}
          </p>
        )}
      </div>

      {providers.data?.passwordEnabled !== false && (
        <>
          <div className="flex items-center gap-3 text-caption text-ink-muted">
            <span aria-hidden className="h-px flex-1 bg-edge" />
            {t("auth.signIn.or")}
            {lastMethod === "password" && lastUsed}
            <span aria-hidden className="h-px flex-1 bg-edge" />
          </div>

          <form className="flex flex-col gap-4" noValidate onSubmit={(e) => void onSubmit(e)} aria-label={t("auth.signIn.passwordForm")}>
            <Field label={t("auth.signIn.username")} error={errors.username?.message}>
              <Input autoComplete="username" autoCapitalize="none" spellCheck={false} {...form.register("username")} />
            </Field>
            <div className="flex flex-col gap-1">
              <Field label={t("auth.signIn.password")} error={errors.password?.message}>
                <PasswordInput autoComplete="current-password" {...form.register("password")} />
              </Field>
              <Link
                to="/login/reset"
                search={redirect ? { redirect } : {}}
                className="self-end text-body-sm text-link hover:text-link-hover hover:underline"
              >
                {t("auth.signIn.forgot")}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Controller
                name="remember"
                control={form.control}
                render={({ field }) => (
                  <Checkbox id="remember" checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                )}
              />
              <Label htmlFor="remember" className="font-normal">
                {t("auth.signIn.remember")}
              </Label>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting} disabled={busy}>
              {t("auth.signIn.submit")}
            </Button>
          </form>
        </>
      )}

      {isMockAuth && (
        <InlineAlert tone="info" title={t("auth.demo.title")}>
          {t("auth.demo.body", { email: "priya.raman@example.com", password: DEMO_PASSWORD_HINT })}
        </InlineAlert>
      )}
    </AuthCard>
  );
}
