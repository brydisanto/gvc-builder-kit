import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
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
  title: "{{PROJECT_NAME}}",
  description: "Built with the GVC Builder Kit",
  icons: {
    icon: "/shaka.png",
    apple: "/shaka.png",
  },
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
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1F1F1F",
              color: "#ffffff",
              border: "1px solid rgba(255, 224, 72, 0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
