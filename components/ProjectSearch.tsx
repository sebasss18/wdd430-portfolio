"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ProjectSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      type="search"
      placeholder="Search projects..."
      defaultValue={searchParams.get("query")?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
