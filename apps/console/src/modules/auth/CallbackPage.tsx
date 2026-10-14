import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InlineAlert, Skeleton } from "@agentvault/ui";
import { api } from "../../api";
import { AuthCard, SealVerified, verifiedPauseMs } from "./AuthLayout";
import { safeRedirect, sessionQueryOptions, takePendingSso, type PendingSso } from "./session";

export interface CallbackParams {
  code?: string | undefined;
  state?: string | undefined;
  error?: string | undefined;
}

/** Return leg of single sign-on: check state, exchange the code for a session, continue. */
export function CallbackPage({ code, state, error }: CallbackParams) {
  const { t } = useTranslation("app");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Read once: the pending entry is removed as it is read.
  const [pending] = useState<PendingSso | null>(() => takePendingSso());
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [verified, setVerified] = useState<{ name: string; href: string } | null>(null);
  const started = useRef(false);

  // Problems we can see before calling the API.
  const precheck = error
    ? t("auth.callback.denied")
    : !code || !state
      ? t("auth.callback.invalid")
      : !pending || pending.state !== state
        ? t("auth.callback.stateMismatch")
        : null;

  useEffect(() => {
    if (precheck || started.current || !code || !state || !pending) return;
    started.current = true;
    void api.POST("/api/auth/sso/callback", { body: { code, state } }).then(({ data, error: problem }) => {
      if (!data) {
        setExchangeError(problem?.title ?? t("auth.callback.invalid"));
        return;
      }
      queryClient.setQueryData(sessionQueryOptions.queryKey, data);
      setVerified({ name: data.user.name, href: safeRedirect(pending.redirect) });
    });
  }, [precheck, code, state, pending, queryClient, t]);

  useEffect(() => {
    if (!verified) return;
    const timer = window.setTimeout(() => void navigate({ href: verified.href, replace: true }), verifiedPauseMs());
    return () => window.clearTimeout(timer);
  }, [verified, navigate]);

  if (verified) {
    return (
      <SealVerified
        name={verified.name}
        destination={verified.href.startsWith("/app") ? t("auth.success.console") : t("auth.success.portal")}
      />
    );
  }

  const failure = precheck ?? exchangeError;
  return (
    <AuthCard
      title={failure ? t("auth.callback.failedTitle") : t("auth.callback.title")}
      lead={failure ? undefined : t("auth.callback.lead", { provider: pending?.providerName ?? "" })}
    >
      {failure ? (
        <>
          <InlineAlert tone="danger" title={failure} />
          <Link to="/login" className="text-body-sm text-link hover:text-link-hover hover:underline">
            {t("auth.backToSignIn")}
          </Link>
        </>
      ) : (
        <div role="status" aria-busy="true" className="flex flex-col gap-2">
          <span className="sr-only">{t("auth.callback.title")}</span>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
    </AuthCard>
  );
}
