import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
