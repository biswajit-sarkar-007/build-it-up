import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Is my data safe?',
    a: 'Absolutely. SchemaGen runs entirely in your browser — your JSON is never sent to any server. There are no analytics, cookies, or tracking.',
  },
  {
    q: 'What JSON structures are supported?',
    a: 'Arrays of objects, nested objects, and even deeply nested structures. SchemaGen flattens nested objects into separate related tables with foreign keys.',
  },
  {
    q: 'How does it detect foreign keys?',
    a: 'Fields ending in _id, Id, or matching the pattern table_id are automatically recognized as foreign key references and linked to detected tables.',
  },
  {
    q: 'Can I use the generated schemas in production?',
    a: 'Yes. The output includes proper types, NOT NULL constraints, indexes, and relationships. Review the generated code and adjust naming or constraints to your team\'s standards.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'The file upload supports JSON files up to 2 MB. For paste input, there is no hard limit, but very large payloads may slow down your browser.',
  },
  {
    q: 'Is this free?',
    a: 'Yes, SchemaGen is completely free with no usage limits. There is no sign-up required.',
  },
];

const FaqSection: React.FC = () => (
  <section id="faq" className="py-24 px-5 bg-secondary/20">
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Common questions
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-lg border border-border bg-card px-5 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FaqSection;
