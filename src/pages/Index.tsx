import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ArrowLeft, Zap } from 'lucide-react';
import JsonInputPanel from '@/components/JsonInputPanel';
import SchemaOutputTabs from '@/components/SchemaOutputTabs';
import RelationshipMap from '@/components/RelationshipMap';
import { analyzeJSON } from '@/lib/jsonAnalyzer';
import { generatePostgreSQL, generateMongoose, generatePrisma } from '@/lib/schemaGenerators';
import type { SchemaIR } from '@/lib/schemaIR';

const Index = () => {
  const [result, setResult] = useState<{
    ir: SchemaIR;
    postgresql: string;
    mongoose: string;
    prisma: string;
  } | null>(null);

  const handleJsonSubmit = useCallback((json: unknown) => {
    const ir = analyzeJSON(json);
    if (ir.tables.length === 0 && ir.warnings.length === 0) {
      ir.warnings.push('JSON has no detectable fields');
    }
    const postgresql = generatePostgreSQL(ir);
    const mongoose = generateMongoose(ir);
    const prisma = generatePrisma(ir);
    setResult({ ir, postgresql, mongoose, prisma });
  }, []);

  const handleBack = () => setResult(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/15">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">SchemaGen AI</h1>
              <p className="text-xs text-muted-foreground">JSON → Database Schema</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" />
              Client-side Processing
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero */}
              <div className="text-center mb-10">
                <motion.h2
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="hero-gradient-text">Smart JSON</span>
                  <span className="text-foreground"> → Database Schema</span>
                </motion.h2>
                <motion.p
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Paste or upload any JSON and instantly get production-ready schemas for PostgreSQL, MongoDB, and Prisma ORM.
                </motion.p>

                {/* Target badges */}
                <motion.div
                  className="flex justify-center gap-3 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { icon: '🐘', label: 'PostgreSQL', sub: 'DDL + indexes' },
                    { icon: '🍃', label: 'MongoDB', sub: 'Mongoose schema' },
                    { icon: '◆', label: 'Prisma', sub: 'schema.prisma' },
                  ].map(t => (
                    <div key={t.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
                      <span className="text-lg">{t.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Input Panel */}
              <div className="max-w-3xl mx-auto">
                <JsonInputPanel onJsonSubmit={handleJsonSubmit} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to editor
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SchemaOutputTabs
                    postgresql={result.postgresql}
                    mongoose={result.mongoose}
                    prisma={result.prisma}
                    ir={result.ir}
                  />
                </div>
                <div>
                  <RelationshipMap ir={result.ir} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            SchemaGen AI — Type inference, relationship detection, and schema generation all run in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
