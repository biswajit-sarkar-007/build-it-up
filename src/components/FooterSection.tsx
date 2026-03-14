import React from 'react';
import { Database } from 'lucide-react';

const FooterSection: React.FC = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/15">
            <Database className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">
            Schema<span className="text-primary">Gen</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {['About', 'How It Works', 'FAQ'].map((label) => (
            <button
              key={label}
              onClick={() => {
                const id = label.toLowerCase().replace(/\s+/g, '-');
                document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SchemaGen. All processing runs locally.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
