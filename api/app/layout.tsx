import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GVC Builder API",
  description: "Community data API for Good Vibes Club builders",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
