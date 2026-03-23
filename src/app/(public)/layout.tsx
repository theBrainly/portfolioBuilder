import ThemeProvider from "@/components/ThemeProvider";
import GridBackground from "@/components/effects/GridBackground";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GridBackground />
      {children}
    </ThemeProvider>
  );
}
