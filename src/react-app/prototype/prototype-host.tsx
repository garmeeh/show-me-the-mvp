// PROTOTYPE, throw away. Two Nutritics-inspired theme variants on the home
// route, switchable via ?variant= (current | A | B). Dev builds only.
import { useLayoutEffect } from "react";
import App from "../App";
import { PrototypeSwitcher, readVariant } from "./prototype-switcher";
import { useProtoBrief } from "./use-proto-brief";
import { VariantA, variantAName } from "./variant-a";
import { VariantB, variantBName } from "./variant-b";

const names = { A: variantAName, B: variantBName };

export function PrototypeHost() {
  const variant = readVariant();
  const proto = useProtoBrief();

  // Variants are light-mode: drop the blueprint's dark class and scope their
  // token overrides with data-proto on <html>.
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (variant === "current") return;
    html.classList.remove("dark");
    html.dataset.proto = variant.toLowerCase();
  }, [variant]);

  if (variant === "current")
    return (
      <>
        <App />
        <PrototypeSwitcher current={variant} names={names} />
      </>
    );
  return (
    <>
      {variant === "A" && <VariantA proto={proto} />}
      {variant === "B" && <VariantB proto={proto} />}
      <PrototypeSwitcher current={variant} names={names} proto={proto} />
    </>
  );
}
