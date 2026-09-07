"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";
import CommandPalette from "@/components/ui/CommandPalette";
import { SessionUser } from "@/types";

interface DashboardClientLayoutProps {
  user: SessionUser;
  children: React.ReactNode;
}

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;
const STORAGE_KEY = "jlu-erp-sidebar-width";

export default function DashboardClientLayout({
  user,
  children,
}: DashboardClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const layoutContainerRef = useRef<HTMLDivElement>(null);

  // Restore persisted width from localStorage on mount
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("jlu_sidebar_width");
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= MIN_WIDTH && val <= MAX_WIDTH) {
          setSidebarWidth(val);
          if (layoutContainerRef.current) {
            layoutContainerRef.current.style.setProperty(
              "--sidebar-width",
              `${val}px`
            );
          }
        }
      }
    } catch {}
  }, []);

  // Called during active dragging: updates CSS variable directly (0 React tree re-renders!)
  const handleWidthChanging = (newWidth: number) => {
    if (layoutContainerRef.current) {
      layoutContainerRef.current.style.setProperty(
        "--sidebar-width",
        `${newWidth}px`
      );
    }
  };

  // Called when dragging finishes: commits React state and writes to localStorage ONCE
  const handleWidthChanged = (finalWidth: number) => {
    setSidebarWidth(finalWidth);
    if (layoutContainerRef.current) {
      layoutContainerRef.current.style.setProperty(
        "--sidebar-width",
        `${finalWidth}px`
      );
    }
    try {
      localStorage.setItem(STORAGE_KEY, finalWidth.toString());
      localStorage.setItem("jlu_sidebar_width", finalWidth.toString());
    } catch {}
  };

  // Reset to default width (260px)
  const handleResetWidth = () => {
    setSidebarWidth(DEFAULT_WIDTH);
    if (layoutContainerRef.current) {
      layoutContainerRef.current.style.setProperty(
        "--sidebar-width",
        `${DEFAULT_WIDTH}px`
      );
    }
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_WIDTH.toString());
      localStorage.setItem("jlu_sidebar_width", DEFAULT_WIDTH.toString());
    } catch {}
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <div
        ref={layoutContainerRef}
        className="min-h-screen bg-slate-50 flex"
        style={
          {
            "--sidebar-width": `${sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {/* Role-Specific Navigation Sidebar */}
        <Sidebar
          role={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          width={sidebarWidth}
          onWidthChanging={handleWidthChanging}
          onWidthChanged={handleWidthChanged}
          onResetWidth={handleResetWidth}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 jlu-main-viewport">
          <Header
            user={user}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenSearch={() => setCommandPaletteOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Keyboard-Driven Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          userRole={user.role}
        />
      </div>
    </ToastProvider>
  );
}
