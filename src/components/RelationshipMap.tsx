import React from 'react';
import type { SchemaIR } from '@/lib/schemaIR';

interface RelationshipMapProps {
  ir: SchemaIR;
}

const RelationshipMap: React.FC<RelationshipMapProps> = ({ ir }) => {
  if (ir.tables.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Entity Relationships</h3>
      <div className="space-y-3">
        {ir.tables.map((table) => (
          <div key={table.name} className="rounded-md border border-border bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono text-sm font-semibold text-foreground">{table.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{table.columns.length} cols</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {table.columns.map(col => (
                <span
                  key={col.name}
                  className={`rounded px-2 py-0.5 text-xs font-mono ${
                    col.primaryKey
                      ? 'bg-primary/20 text-primary'
                      : col.foreignKey
                      ? 'bg-violet/20 text-violet'
                      : col.index
                      ? 'bg-amber/20 text-amber'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {col.name}
                  {col.primaryKey && ' 🔑'}
                  {col.foreignKey && ' →'}
                </span>
              ))}
            </div>
            {/* FK arrows */}
            {table.columns.filter(c => c.foreignKey).map(col => (
              <div key={col.name} className="mt-2 text-xs text-muted-foreground font-mono pl-4">
                └─ {col.name} → {col.foreignKey!.table}.{col.foreignKey!.column}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" /> Primary Key
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-violet" /> Foreign Key
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-amber" /> Indexed
        </span>
      </div>
    </div>
  );
};

export default RelationshipMap;
