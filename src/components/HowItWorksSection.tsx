import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Paste or Upload',
    desc: 'Drop in any JSON — an API response, a config file, mock data. Arrays and nested objects are fully supported.',
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'SchemaGen scans every field: detects types (UUID, date, email), infers foreign keys, and maps relationships.',
  },
  {
    num: '03',
    title: 'Generate',
    desc: 'Get PostgreSQL DDL with indexes, Mongoose schemas with validation, and Prisma models — all in one click.',
  },
  {
    num: '04',
    title: 'Export',
    desc: 'Copy any schema to your clipboard or download all three as a ZIP. Plug them straight into your project.',
  },
];

const HowItWorksSection: React.FC = () => (
  <section id="how-it-works" className="py-24 px-5 bg-secondary/20">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Process</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Four steps. Zero config.
        </h2>
      </motion.div>

      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border hidden sm:block" />

        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-5 items-start"
            >
              <div className="shrink-0 relative z-10 flex items-center justify-center h-[54px] w-[54px] rounded-xl border border-border bg-card font-mono text-sm font-bold text-primary">
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
