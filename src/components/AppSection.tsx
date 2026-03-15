import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import JsonInputPanel from '@/components/JsonInputPanel';
import SchemaOutputTabs from '@/components/SchemaOutputTabs';
import RelationshipMap from '@/components/RelationshipMap';
import { analyzeJSON } from '@/lib/jsonAnalyzer';
import { generatePostgreSQL, generateMongoose, generatePrisma, generateDrizzle } from '@/lib/schemaGenerators';
import type { SchemaIR } from '@/lib/schemaIR';

const AppSection: React.FC = () => {
  const [result, setResult] = useState<{
    ir: SchemaIR;
    postgresql: string;
    mongoose: string;
    prisma: string;
    drizzle: string;
  } | null>(null);

  const handleJsonSubmit = useCallback((json: unknown) => {
    const ir = analyzeJSON(json);
    if (ir.tables.length === 0 && ir.warnings.length === 0) {
      ir.warnings.push('JSON has no detectable fields');
    }
    const postgresql = generatePostgreSQL(ir);
    const mongoose = generateMongoose(ir);
    const prisma = generatePrisma(ir);
    const drizzle = generateDrizzle(ir);
    setResult({ ir, postgresql, mongoose, prisma, drizzle });
  }, []);

  const handleBack = () => setResult(null);

  return (
    <section id="app" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Try it</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Generate your schema now
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Paste JSON below or upload a file. Results appear instantly.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto"
            >
              <JsonInputPanel onJsonSubmit={handleJsonSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
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
                    drizzle={result.drizzle}
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
      </div>
    </section>
  );
};

export default AppSection;
