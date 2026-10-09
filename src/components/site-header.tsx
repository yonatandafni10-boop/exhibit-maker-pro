import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brick";
import { LangPicker, useI18n } from "@/lib/i18n";
import { useIsAdmin } from "@/lib/site-data";

export function SiteHeader({ back }: { back?: boolean }) {
  const { t } = useI18n();
  const isAdmin = useIsAdmin();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link to="/"><Logo /></Link>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link to="/admin" className="rounded-full bg-brick-yellow px-4 py-2 text-sm font-black shadow-sm">✏️ {t("admin")}</Link>
        )}
        <LangPicker />
        {back && (
          <Link to="/" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm">{t("back")}</Link>
        )}
      </div>
    </div>
  );
}
