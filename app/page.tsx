'use client';

import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-black overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animae-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Next-Gen AI Chat
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Experience the future of conversational AI with a sleek, streaming-first interface.
          </p>
        </div>

        <Chat />

        <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <img src="/next.svg" alt="Next.js" className="h-4 dark:invert" />
          <div className="w-px h-4 bg-white/20" />
          <img src="/vercel.svg" alt="Vercel" className="h-4 dark:invert" />
          <div className="w-px h-4 bg-white/20" />
          <span className="text-xs font-semibold text-white tracking-widest uppercase">Google Gemini</span>
        </div>
      </main>
    </div>
  );
}
