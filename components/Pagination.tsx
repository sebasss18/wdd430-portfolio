"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      <Link
        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
        className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
          currentPage <= 1
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:scale-105 hover:bg-slate-800 hover:text-white hover:shadow-md"
        }`}
      >
        Previous
      </Link>

      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
        className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
          currentPage >= totalPages
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:scale-105 hover:bg-slate-800 hover:text-white hover:shadow-md"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
