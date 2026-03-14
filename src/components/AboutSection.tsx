import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Code2, Layers } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    desc: 'Type inference, relationship detection, and schema generation happen in milliseconds — no server round-trips.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'Your JSON never leaves the browser. Zero tracking, zero uploads. Just local processing.',
  },
  {
    icon: Layers,
    title: 'Multi-Target Output',
    desc: 'One input, three production-ready schemas: PostgreSQL DDL, Mongoose models, and Prisma ORM definitions.',
  },
  {
    icon: Code2,
    title: 'Smart Detection',
    desc: 'Automatically identifies UUIDs, emails, dates, enums, foreign keys, and nested structures.',
  },
];

const AboutSection: React.FC = () => (
  <section id="about" className="py-24 px-5">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Why SchemaGen</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          From raw data to database-ready — in seconds
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          No more manually mapping JSON fields to column types. SchemaGen handles the boring parts so you can focus on building.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
