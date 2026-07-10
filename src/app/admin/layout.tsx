import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "sunai.studio | Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col bg-bone text-ink font-sans antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
