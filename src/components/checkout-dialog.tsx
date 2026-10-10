import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrickStrip } from "@/components/brick";
import { useI18n } from "@/lib/i18n";

// PayPal Client ID is public (safe in code). Set it once the owner provides it.
export const PAYPAL_CLIENT_ID = "BAA_A3J86cQ99PJRCzNsg0rDBGANY-lI1XEDbDLT_iwn6oL1UdjYmeRiPw6luLOHhwu3_0nB2xX2xJ3b7k";

const schema = z.object({
  fullName: z.string().trim().min(2, "required").max(100),
  email: z.string().trim().min(1, "required").email("badEmail").max(255),
  phone: z.string().trim().min(1, "required").regex(/^[0-9+\-\s]{7,20}$/, "badPhone"),
  country: z.string().trim().min(2, "required").max(60),
  city: z.string().trim().min(2, "required").max(60),
  street: z.string().trim().min(2, "required").max(120),
  zip: z.string().trim().max(15).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
type Form = z.infer<typeof schema>;

const fields: { key: keyof Form; label: string; type?: string; full?: boolean }[] = [
  { key: "fullName", label: "fullName", full: true },
  { key: "email", label: "email", type: "email" },
  { key: "phone", label: "phone", type: "tel" },
  { key: "country", label: "country" },
  { key: "city", label: "city" },
  { key: "street", label: "street", full: true },
  { key: "zip", label: "zip" },
  { key: "notes", label: "notes" },
];

type Props = { open: boolean; onOpenChange: (o: boolean) => void; set: { name: string; slug: string; price: number | null; image: string } };

export function CheckoutDialog({ open, onOpenChange, set }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<Form>({ fullName: "", email: "", phone: "", country: "", city: "", street: "", zip: "", notes: "" });
  const { t, price, dir } = useI18n();
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const next = () => {
    const r = schema.safeParse(form);
    if (!r.success) {
      const e: Partial<Record<keyof Form, string>> = {};
      for (const i of r.error.issues) e[i.path[0] as keyof Form] ??= i.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o && step === 3) setStep(1); }}>
      <DialogContent dir={dir} className="max-h-[92vh] overflow-y-auto rounded-3xl text-start sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-black">{t("purchase")}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 p-3">
          <img src={set.image} alt="" className="h-14 w-14 rounded-xl bg-card object-contain p-1" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{set.name}</div>
            <div className="text-lg font-black text-brick-red">{price(set.price)}</div>
          </div>
        </div>

        <Steps step={step} />

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <label key={f.key} className={`flex flex-col gap-1 ${f.full ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
                <span className="text-xs font-bold text-muted-foreground">{t(f.label)}</span>
                <input
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={`rounded-xl border-2 bg-card px-3 py-2.5 text-sm outline-none focus:border-brick-blue ${errors[f.key] ? "border-brick-red" : "border-border"}`}
                />
                {errors[f.key] && <span className="text-xs font-medium text-brick-red">{t(errors[f.key]!)}</span>}
              </label>
            ))}
            {Object.keys(errors).length > 0 && <p className="col-span-2 rounded-xl bg-brick-red/10 p-2 text-center text-sm font-bold text-brick-red">{t("fixRed")}</p>}
            <button onClick={next} className="col-span-2 mt-2 rounded-2xl bg-brick-red py-3.5 text-lg font-black text-primary-foreground shadow-sm transition hover:brightness-110">
              {t("next")}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border p-3 text-sm">
              <div className="mb-1 font-bold">{t("shipTo")}</div>
              <div className="text-muted-foreground">{form.fullName} · {form.phone}</div>
              <div className="text-muted-foreground">{form.street}, {form.city}, {form.country}</div>
              <button onClick={() => setStep(1)} className="mt-2 text-xs font-bold text-brick-blue">{t("edit")}</button>
            </div>
            <div className="text-sm font-bold">{t("choosePay")}</div>
            <PayPalButtons set={set} form={form} onPaid={() => setStep(3)} />
            <p className="text-center text-xs text-muted-foreground">{t("secure")}</p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-5xl">🎉</div>
            <div className="text-2xl font-black">{t("thanks")}</div>
            <p className="text-muted-foreground">{t("thanksSub")}</p>
            <BrickStrip />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Steps({ step }: { step: number }) {
  const { t } = useI18n();
  const s = [t("stepDetails"), t("stepPay"), t("stepDone")];
  return (
    <div className="flex gap-2">
      {s.map((l, i) => (
        <div key={l} className="flex-1">
          <div className={`h-2 rounded-sm ${i + 1 <= step ? ["bg-brick-red", "bg-brick-yellow", "bg-brick-green"][i] : "bg-secondary"}`} />
          <div className={`mt-1 text-xs font-bold ${i + 1 === step ? "" : "text-muted-foreground"}`}>{l}</div>
        </div>
      ))}
    </div>
  );
}

type PP = {
  Buttons: (o: Record<string, unknown>) => { isEligible: () => boolean; render: (el: HTMLElement) => Promise<void> };
  FUNDING: { PAYPAL: string; CARD: string };
};

function PayPalButtons({ set, form, onPaid }: { set: Props["set"]; form: Form; onPaid: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState("");
  const { t, currency, convert, lang } = useI18n();
  const latest = useRef({ form, onPaid, t });
  latest.current = { form, onPaid, t };

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID || !ref.current) return;
    const el = ref.current;
    const value = convert(set.price ?? 0).toFixed(2);
    const { form, onPaid, t } = latest.current;
    const render = () => {
      const paypal = (window as unknown as { paypal?: PP }).paypal;
      if (!paypal) return;
      el.innerHTML = "";
      for (const fundingSource of [paypal.FUNDING.PAYPAL, paypal.FUNDING.CARD]) {
        const b = paypal.Buttons({
          fundingSource,
          style: { layout: "vertical", shape: "pill", height: 48 },
          createOrder: (_: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
            actions.order.create({
              intent: "CAPTURE",
              purchase_units: [{
                description: `${set.name} | ${form.fullName} | ${form.phone} | ${form.email}`.slice(0, 127),
                invoice_id: `BY-${Date.now()}`,
                custom_id: `${form.street}, ${form.city}, ${form.country} ${form.zip ?? ""}`.slice(0, 127),
                amount: { currency_code: currency, value },
              }],
            }),
          onApprove: async (_: unknown, actions: { order: { capture: () => Promise<unknown> } }) => {
            await actions.order.capture();
            latest.current.onPaid();
          },
          onError: () => setErr(t("payFail")),
        });
        if (b.isEligible()) void b.render(el);
      }
    };
    const id = "paypal-sdk";
    const old = document.getElementById(id);
    if (old?.getAttribute("data-cur") === currency) { render(); return; }
    old?.remove();
    delete (window as unknown as { paypal?: PP }).paypal;
    const locale = { he: "he_IL", en: "en_US", ar: "ar_EG", ru: "ru_RU", fr: "fr_FR", es: "es_ES", de: "de_DE" }[lang];
    const s = document.createElement("script");
    s.id = id;
    s.setAttribute("data-cur", currency);
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&locale=${locale}&enable-funding=card&components=buttons`;
    s.onload = render;
    s.onerror = () => setErr(t("payFail"));
    document.body.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set.slug, set.price, currency, lang]);

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="flex flex-col gap-3">
        <button disabled className="rounded-full bg-brick-yellow py-3.5 font-black opacity-60">PayPal</button>
        <button disabled className="rounded-full bg-foreground py-3.5 font-black text-background opacity-60">💳 כרטיס אשראי</button>
        <p className="text-center text-xs font-bold text-brick-red">התשלום יופעל בקרוב</p>
      </div>
    );
  }
  return (
    <>
      <div ref={ref} />
      {err && <p className="text-center text-sm font-bold text-brick-red">{err}</p>}
    </>
  );
}
