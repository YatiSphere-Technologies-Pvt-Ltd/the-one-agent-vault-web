// Design-partner form: client-side validation, JSON POST to PUBLIC_LEAD_ENDPOINT, inline status.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initPartnerForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-partner-form]");
  if (!form) return;
  const endpoint = form.dataset.endpoint ?? "";
  const status = form.querySelector<HTMLElement>("#partner-status");
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const email = form.querySelector<HTMLInputElement>("#partner-email");
  const company = form.querySelector<HTMLInputElement>("#partner-company");
  const honeypot = form.querySelector<HTMLInputElement>("#partner-website");
  if (!status || !submit || !email || !company) return;
  const label = submit.textContent ?? "";

  const setError = (input: HTMLInputElement, message: string | null) => {
    const el = document.getElementById(`${input.id}-error`);
    if (!el) return;
    el.textContent = message ?? "";
    el.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  };

  const validate = () => {
    const emailOk = EMAIL.test(email.value.trim());
    const companyOk = company.value.trim().length > 0;
    setError(email, emailOk ? null : (form.dataset.msgEmail ?? ""));
    setError(company, companyOk ? null : (form.dataset.msgCompany ?? ""));
    if (!emailOk) email.focus();
    else if (!companyOk) company.focus();
    return emailOk && companyOk;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!endpoint || !validate()) return;
    if (honeypot?.value) {
      // Pretend success for bots.
      status.textContent = form.dataset.msgSuccess ?? "";
      form.reset();
      return;
    }
    submit.disabled = true;
    submit.textContent = form.dataset.msgSending ?? label;
    status.textContent = "";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim(), company: company.value.trim(), source: "landing" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      status.textContent = form.dataset.msgSuccess ?? "";
      form.reset();
    } catch {
      status.textContent = form.dataset.msgError ?? "";
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}
