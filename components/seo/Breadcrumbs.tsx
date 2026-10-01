import Link from "next/link";

export type BreadcrumbItem = { name: string; path: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.18em] text-neutral-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {current ? (
                <span aria-current="page" className="text-neutral-200">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-white transition-colors">{item.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
