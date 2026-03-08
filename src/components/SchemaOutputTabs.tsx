import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { SchemaIR } from '@/lib/schemaIR';

interface SchemaOutputTabsProps {
  postgresql: string;
  mongoose: string;
  prisma: string;
  ir: SchemaIR;
}

const SchemaOutputTabs: React.FC<SchemaOutputTabsProps> = ({ postgresql, mongoose, prisma, ir }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('schema.sql', postgresql);
    zip.file('schema.js', mongoose);
    zip.file('schema.prisma', prisma);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'schemagen-output.zip');
  };

  const tabs = [
    { id: 'postgresql', label: '🐘 PostgreSQL', content: postgresql, ext: '.sql', color: 'text-cyan' },
    { id: 'mongodb', label: '🍃 MongoDB', content: mongoose, ext: '.js', color: 'text-emerald' },
    { id: 'prisma', label: '◆ Prisma', content: prisma, ext: '.prisma', color: 'text-violet' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <span className="rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground font-mono">
          {ir.tables.length} table{ir.tables.length !== 1 ? 's' : ''} detected
        </span>
        <span className="rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground font-mono">
          {ir.relationships.length} relationship{ir.relationships.length !== 1 ? 's' : ''}
        </span>
        <span className="rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground font-mono">
          {ir.indexes.length} index{ir.indexes.length !== 1 ? 'es' : ''} suggested
        </span>
      </div>

      {/* Warnings */}
      {ir.warnings.length > 0 && (
        <div className="rounded-lg border border-amber/30 bg-amber/5 px-4 py-3">
          {ir.warnings.map((w, i) => (
            <p key={i} className="text-sm text-amber">⚠ {w}</p>
          ))}
        </div>
      )}

      <Tabs defaultValue="postgresql" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-secondary border border-border">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadZip}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Download ZIP
          </motion.button>
        </div>

        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <div className="relative">
              <button
                onClick={() => copyToClipboard(tab.content, tab.id)}
                className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-secondary/80 backdrop-blur px-3 py-1.5 text-xs text-secondary-foreground hover:bg-muted transition-colors z-10"
              >
                {copiedTab === tab.id ? (
                  <><Check className="h-3.5 w-3.5" /> Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </button>
              <pre className="schema-code-block max-h-[500px] overflow-auto">
                <code>{tab.content}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SchemaOutputTabs;
