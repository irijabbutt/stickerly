import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-start">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                S
              </span>
              <span>Stickerly</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>{t("rights", { year })}</p>
            <p className="mt-1">{t("powered")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
