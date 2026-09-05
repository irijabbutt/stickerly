import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFoundPage() {
  const t = useTranslations("nav");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t("home")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-background font-medium hover:opacity-90 transition"
      >
        {t("home")}
      </Link>
    </div>
  );
}
