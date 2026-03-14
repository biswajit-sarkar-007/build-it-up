import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I used to spend 30 minutes translating API responses into Prisma models. SchemaGen does it in literally two seconds.",
    name: 'Marcus Chen',
    role: 'Full-Stack Developer',
    initials: 'MC',
  },
  {
    quote: "The FK detection is surprisingly good. It picked up on our naming convention immediately and mapped every relationship correctly.",
    name: 'Sarah Okafor',
    role: 'Database Engineer',
    initials: 'SO',
  },
  {
    quote: "Love that nothing leaves the browser. We deal with sensitive data and this tool fits perfectly into our security policy.",
    name: 'James Whitfield',
    role: 'CTO, Stealth Startup',
    initials: 'JW',
  },
];

const TestimonialsSection: React.FC = () => (
  <section id="testimonials" className="py-24 px-5">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Testimonials</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Developers love the speed
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-6 flex flex-col"
          >
            <p className="text-sm text-foreground/90 leading-relaxed flex-1 mb-5">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/15 text-primary text-xs font-bold">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
