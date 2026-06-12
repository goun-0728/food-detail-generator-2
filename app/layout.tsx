import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "식품 상세페이지 생성기",
  description: "네이버 스마트스토어 식품 상세페이지 카피 생성기 (Fable 5)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
