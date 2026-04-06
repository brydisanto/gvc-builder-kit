import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const brice = localFont({
  src: [
    { path: "../public/fonts/Brice-Bold.otf", weight: "700" },
    { path: "../public/fonts/Brice-Black.otf", weight: "900" },
  ],
  variable: "--font-brice",
  display: "swap",
});

const mundial = localFont({
  src: [
    { path: "../public/fonts/Mundial-Regular.otf", weight: "400" },
    { path: "../public/fonts/MundialDemibold.otf", weight: "600" },
    { path: "../public/fonts/Mundial-Bold.otf", weight: "700" },
  ],
  variable: "--font-mundial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Prompt Machine - Good Vibes Club",
  description: "Generate AI images of your Good Vibes Club characters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${brice.variable} ${mundial.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
