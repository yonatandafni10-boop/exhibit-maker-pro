import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrickStrip, formatPrice } from "@/components/brick";

// PayPal Client ID is public (safe in code). Set it once the owner provides it.
export const PAYPAL_CLIENT_ID = "BAA_A3J86cQ99PJRCzNsg0rDBGANY-lI1XEDbDLT_iwn6oL1UdjYmeRiPw6luLOHhwu3_0nB2xX2xJ3b7k";

const schema = z.object({
  fullName: z.string().trim().min(2, "נא למלא שם מלא").max(100),
  email: z.string().trim().email("אימייל לא תקין").max(255),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "טלפון לא תקין"),
  country: z.string().trim().min(2, "נא למלא מדינה").max(60),
  city: z.string().trim().min(2, "נא למלא עיר").max(60),
  street: z.string().trim().min(2, "נא למלא רחוב ומספר").max(120),
  zip: z.string().trim().max(15).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
type Form = z.infer<typeof schema>;

const fields: { key: keyof Form; label: string; type?: string; full?: boolean }[] = [
  { key: "fullName", label: "שם מלא", full: true },
  { key: "email", label: "אימייל", type: "email" },
  { key: "phone", label: "טלפון", type: "tel" },
  { key: "country", label: "מדינה" },
  { key: "city", label: "עיר" },
  { key: "street", label: "רחוב ומספר בית", full: true },
  { key: "zip", label: "מיקוד (לא חובה)" },
  { key: "notes", label: "הערות למשלוח (לא חובה)" },
];

type Props = { open: boolean; onOpenChange: (o: boolean) => void; set: { name: string; slug: string; price: number | null; image: string } };

export function CheckoutDialog({ open, onOpenChange, set }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<Form>({ fullName: "", email: "", phone: "", country: "ישראל", city: "", street: "", zip: "", notes: "" });
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
      <DialogContent dir="rtl" className="max-h-[92vh] overflow-y-auto rounded-3xl text-right sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-black">רכישה</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 p-3">
          <img src={set.image} alt="" className="h-14 w-14 rounded-xl bg-card object-contain p-1" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{set.name}</div>
            <div className="text-lg font-black text-brick-red">{formatPrice(set.price)}</div>
          </div>
        </div>

        <Steps step={step} />

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <label key={f.key} className={`flex flex-col gap-1 ${f.full ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
                <span className="text-xs font-bold text-muted-foreground">{f.label}</span>
                <input
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={`rounded-xl border-2 bg-card px-3 py-2.5 text-sm outline-none focus:border-brick-blue ${errors[f.key] ? "border-brick-red" : "border-border"}`}
                />
                {errors[f.key] && <span className="text-xs font-medium text-brick-red">{errors[f.key]}</span>}
              </label>
            ))}
            <button onClick={next} className="col-span-2 mt-2 rounded-2xl bg-brick-red py-3.5 text-lg font-black text-primary-foreground shadow-sm transition hover:brightness-110">
              הבא ←
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border p-3 text-sm">
              <div className="mb-1 font-bold">משלוח אל:</div>
              <div className="text-muted-foreground">{form.fullName} · {form.phone}</div>
              <div className="text-muted-foreground">{form.street}, {form.city}, {form.country}</div>
              <button onClick={() => setStep(1)} className="mt-2 text-xs font-bold text-brick-blue">עריכת פרטים</button>
            </div>
            <div className="text-sm font-bold">בחר אמצעי תשלום:</div>
            <PayPalButtons set={set} form={form} onPaid={() => setStep(3)} />
            <p className="text-center text-xs text-muted-foreground">🔒 התשלום מאובטח ע״י PayPal. פרטי האשראי לא נשמרים אצלנו.</p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-5xl">🎉</div>
            <div className="text-2xl font-black">תודה על ההזמנה!</div>
            <p className="text-muted-foreground">התשלום התקבל וההזמנה בטיפול.</p>
            <p className="text-xs text-muted-foreground">נעדכן אותך באימייל ובווטסאפ כשההזמנה תגיע.</p>
            <BrickStrip />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Steps({ step }: { step: number }) {
  const s = ["פרטים וכתובת", "תשלום", "סיום"];
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

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID || !ref.current) return;
    const el = ref.current;
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
              purchase_units: [{
                description: `${set.name} | ${form.fullName} | ${form.phone} | ${form.email}`.slice(0, 127),
                invoice_id: `BY-${Date.now()}`,
                custom_id: set.slug.slice(0, 127),
                amount: { currency_code: "ILS", value: (set.price ?? 0).toFixed(2) },
                shipping: {
                  name: { full_name: form.fullName },
                  address: { address_line_1: form.street, admin_area_2: form.city, postal_code: form.zip || undefined, country_code: "IL" },
                },
              }],
            }),
          onApprove: async (_: unknown, actions: { order: { capture: () => Promise<unknown> } }) => {
            await actions.order.capture();
            onPaid();
          },
          onError: () => setErr("התשלום נכשל, נסה שוב."),
        });
        if (b.isEligible()) void b.render(el);
      }
    };
    const id = "paypal-sdk";
    if (document.getElementById(id)) return render();
    const s = document.createElement("script");
    s.id = id;
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=ILS&locale=he_IL&enable-funding=card`;
    s.onload = render;
    document.body.appendChild(s);
  }, [set, form, onPaid]);

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
