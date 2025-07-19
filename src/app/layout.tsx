import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Provider } from "@/components/Provider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Xem điểm LMS ICTU",
  description: "Xem điểm các bài kiểm tra trắc nghiệm trên LMS ICTU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
