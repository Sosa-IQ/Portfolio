import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "rise" | "left" | "right" | "scale" | "diagram";
};

export function Reveal({ children, className = "", delay = 0, direction = "rise" }: RevealProps) {
  return (
    <div
      className={className}
      data-scroll={direction}
      data-scroll-delay={delay || undefined}
    >
      {children}
    </div>
  );
}
