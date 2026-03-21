"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "fade";
  style?: CSSProperties;
  className?: string;
}

export default function AnimateIn({
  children,
  delay = 0,
  direction = "up",
  style,
  className,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden: CSSProperties =
    direction === "up"
      ? { opacity: 0, transform: "translateY(20px)" }
      : { opacity: 0 };

  const shown: CSSProperties = { opacity: 1, transform: "translateY(0)" };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        ...(visible ? shown : hidden),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
