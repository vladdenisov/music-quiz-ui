import { Link } from "react-router-dom";
import { Brand } from "../components/Brand";
import { strings } from "../shared/i18n/strings";

export function NotFoundPage() {
  return (
    <main className="min-h-screen p-5 sm:p-8">
      <Brand />
      <section className="panel mx-auto mt-16 max-w-xl p-8 text-center">
        <h1 className="font-display text-5xl uppercase">404</h1>
        <p className="mt-4 text-lg">Такой страницы нет.</p>
        <Link className="button-primary mt-8 inline-block" to="/">
          {strings.backHome}
        </Link>
      </section>
    </main>
  );
}
