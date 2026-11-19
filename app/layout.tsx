import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const aptos = localFont({
  src: [
    {
      path: "../public/fonts/aptos/Aptos-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/aptos/Aptos.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/aptos/Aptos-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/aptos/Aptos-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/aptos/Aptos-SemiBold-Italic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/aptos/Aptos-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/aptos/Aptos-Bold-Italic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/aptos/Aptos-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/aptos/Aptos-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-aptos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JLU Digital Campus | Jagran Lakecity University",
  description:
    "Official ERP & Learning Management Platform for Jagran Lakecity University, Bhopal — Central India's Diamond University. One Connected Ecosystem for Academics, Timetables, Attendance, Fees, and LMS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${aptos.variable} font-sans`}>
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
