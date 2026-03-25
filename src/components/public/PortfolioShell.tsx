import ThemeProvider from "@/components/ThemeProvider";
import GridBackground from "@/components/effects/GridBackground";
import type { ISiteSettings } from "@/types";

export default function PortfolioShell({
  settings,
  children,
}: {
  settings: ISiteSettings | null;
  children: React.ReactNode;
}) {
  const preset = settings?.designPreset || "classic";

  return (
    <ThemeProvider defaultPalette={settings?.themePalette || "graphite"}>
      <div data-design-preset={preset} className="relative min-h-screen">
        <GridBackground preset={preset} />
        {children}
      </div>
    </ThemeProvider>
  );
}
