"use client";
import { useEffect } from "react";

export function useDialogFocus(open, ref, close) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => [...ref.current.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex="0"]')].filter((element) => element.getClientRects().length);
    focusable()[0]?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab") return;
      const elements = focusable(), first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [open, ref, close]);
}
