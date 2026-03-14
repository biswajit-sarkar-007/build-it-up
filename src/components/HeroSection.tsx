import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Terminal, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToApp = () => {
    document.querySelector('#app')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/8 blur-[100px]" />

      <div className="relative max-w-5xl mx-auto px-5 text-center">
        {/* Top pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-8"
        >
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">100% client-side · No data leaves your browser</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            <span className="text-foreground">Stop writing</span>
            <br />
            <span className="text-foreground">schemas </span>
            <span className="relative inline-block">
              <span className="hero-gradient-text">by hand.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Drop in any JSON payload and get production-ready database
          schemas for PostgreSQL, MongoDB, and Prisma — instantly.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={scrollToApp}
            className="group flex items-center gap-2.5 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Sparkles className="h-4 w-4" />
            Try It Now — It's Free
          </button>
          <a
            href="#how-it-works"
            onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border hover:decoration-muted-foreground"
          >
            See how it works
          </a>
        </motion.div>

        {/* Code preview mock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">schemagen — output</span>
            </div>
            {/* Code content */}
            <div className="p-5 text-left font-mono text-sm leading-relaxed overflow-hidden max-h-52">
              <div className="text-muted-foreground">
                <span className="text-primary/70">{"{"}</span> <span className="text-foreground">"users"</span>: <span className="text-primary/70">[</span>
              </div>
              <div className="pl-4 text-muted-foreground">
                <span className="text-primary/70">{"{"}</span> <span className="text-cyan">"id"</span>: <span className="text-amber">"uuid"</span>, <span className="text-cyan">"name"</span>: <span className="text-amber">"string"</span>, <span className="text-cyan">"email"</span>: <span className="text-amber">"email"</span> <span className="text-primary/70">{"}"}</span>
              </div>
              <div className="text-muted-foreground pl-0">
                <span className="text-primary/70">{"]"}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <span className="text-primary">→</span> <span className="text-foreground">CREATE TABLE</span> <span className="text-cyan">users</span> <span className="text-muted-foreground">(</span>
              </div>
              <div className="pl-6 text-muted-foreground">
                <span className="text-cyan">id</span> <span className="text-amber">UUID</span> <span className="text-foreground">PRIMARY KEY</span>,
              </div>
              <div className="pl-6 text-muted-foreground">
                <span className="text-cyan">name</span> <span className="text-amber">VARCHAR(255)</span> <span className="text-foreground">NOT NULL</span>,
              </div>
              <div className="pl-6 text-muted-foreground">
                <span className="text-cyan">email</span> <span className="text-amber">VARCHAR(255)</span> <span className="text-foreground">UNIQUE NOT NULL</span>
              </div>
              <div className="text-muted-foreground">
                <span className="text-muted-foreground">);</span>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-14"
        >
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
