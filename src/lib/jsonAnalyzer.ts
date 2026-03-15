// JSON Analysis Pipeline — client-side type inference, nesting, relationships

export interface ColumnDef {
  name: string;
  type: string;
  pgType: string;
  mongoType: string;
  prismaType: string;
  nullable: boolean;
  unique: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  index: boolean;
  default?: string;
  foreignKey?: { table: string; column: string };
  enum?: string[];
  maxLength?: number;
}

export interface RelationshipDef {
  type: "hasOne" | "hasMany" | "belongsTo";
  from: string;
  to: string;
  via: string;
}

export interface IndexDef {
  table: string;
  column: string;
  reason: string;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
  indexes: IndexDef[];
  relationships: RelationshipDef[];
}

export interface SchemaIR {
  tables: TableDef[];
  relationships: RelationshipDef[];
  indexes: IndexDef[];
  warnings: string[];
}

// --- Type Inference ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
const URL_RE = /^https?:\/\//;

const TEXT_FIELD_HEURISTICS = ['message', 'description', 'bio', 'content', 'logs', 'note', 'body', 'payload'];
const COUNT_FIELD_HEURISTICS = ['count', 'downloads', 'views', 'score', 'total', 'quantity', 'points', 'likes'];
const STATUS_FIELD_HEURISTICS = ['status', 'type', 'role', 'category', 'state', 'gender', 'mode', 'visibility'];
const DECIMAL_FIELD_HEURISTICS = ['price', 'amount', 'balance', 'cost', 'tax', 'vat', 'fee', 'discount', 'shipping', 'subtotal', 'total'];

function inferType(values: unknown[], colName?: string): Pick<ColumnDef, 'type' | 'pgType' | 'mongoType' | 'prismaType' | 'enum' | 'maxLength' | 'default'> {
  const nonNull = values.filter(v => v !== null && v !== undefined);
  if (nonNull.length === 0) return { type: 'unknown', pgType: 'TEXT', mongoType: 'String', prismaType: 'String' };

  const sample = nonNull.slice(0, 50);
  const snakeName = colName ? toSnakeCase(colName) : '';
  
  // Check booleans
  if (sample.every(v => typeof v === 'boolean')) {
    return { type: 'boolean', pgType: 'BOOLEAN', mongoType: 'Boolean', prismaType: 'Boolean' };
  }

  // Check numbers
  if (sample.every(v => typeof v === 'number')) {
    const allInt = sample.every(v => Number.isInteger(v));
    const isCount = COUNT_FIELD_HEURISTICS.some(h => snakeName.includes(h));
    const isDecimalHeuristic = DECIMAL_FIELD_HEURISTICS.some(h => snakeName === h || snakeName.endsWith('_' + h));
    
    // Force decimal for money-like fields even if sample is all integers
    if (allInt && !isDecimalHeuristic) return { 
      type: 'integer', pgType: 'INT', mongoType: 'Number', prismaType: 'Int',
      default: isCount ? '0' : undefined 
    };
    return { 
      type: 'decimal', pgType: 'NUMERIC(10,2)', mongoType: 'Number', prismaType: 'Decimal',
      default: (isCount || isDecimalHeuristic) ? '0' : undefined
    };
  }

  // Check strings
  if (sample.every(v => typeof v === 'string')) {
    const strs = sample as string[];
    const maxLenSeen = Math.max(...strs.map(s => s.length));

    if (strs.every(s => UUID_RE.test(s))) return { type: 'uuid', pgType: 'UUID', mongoType: 'String', prismaType: 'String' };
    if (strs.every(s => EMAIL_RE.test(s))) return { type: 'email', pgType: 'VARCHAR(255)', mongoType: 'String', prismaType: 'String', maxLength: 255 };
    if (strs.every(s => ISO_DATE_RE.test(s))) return { type: 'date', pgType: 'TIMESTAMPTZ', mongoType: 'Date', prismaType: 'DateTime', default: 'NOW()' };
    if (strs.every(s => URL_RE.test(s))) return { type: 'url', pgType: 'TEXT', mongoType: 'String', prismaType: 'String' };
    
    // Heuristic for TEXT fields
    if (maxLenSeen > 255 || TEXT_FIELD_HEURISTICS.some(h => snakeName.includes(h))) {
      return { type: 'text', pgType: 'TEXT', mongoType: 'String', prismaType: 'String' };
    }

    // Check for enum — aggressively for status-like fields
    const uniq = [...new Set(strs)];
    const isStatusLike = STATUS_FIELD_HEURISTICS.some(h => snakeName === h || snakeName.endsWith('_' + h));
    // Require at least 2 unique values to lock as enum, otherwise it's just a string
    if (isStatusLike && uniq.length >= 2 && uniq.length <= 20) {
      return { type: 'enum', pgType: `VARCHAR(50)`, mongoType: 'String', prismaType: 'String', enum: uniq, maxLength: 50 };
    }
    // Other fields: enum if enough duplicates seen
    if (uniq.length >= 2 && uniq.length <= 15 && uniq.length < strs.length * 0.5) {
      return { type: 'enum', pgType: `VARCHAR(50)`, mongoType: 'String', prismaType: 'String', enum: uniq, maxLength: 50 };
    }
    
    // Realistic max length: provide a buffer or use standard sizes
    let recommendedLen = 255;
    if (maxLenSeen <= 12) recommendedLen = 50; 
    if (maxLenSeen > 50 && maxLenSeen <= 100) recommendedLen = 100;
    if (maxLenSeen > 255) recommendedLen = 1000;

    return { type: 'string', pgType: `VARCHAR(${recommendedLen})`, mongoType: 'String', prismaType: 'String', maxLength: recommendedLen };
  }

  return { type: 'mixed', pgType: 'JSONB', mongoType: 'Schema.Types.Mixed', prismaType: 'Json' };
}

// --- Naming ---
function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

function toTableName(str: string): string {
  const snake = toSnakeCase(str);
  // Simple pluralize
  if (snake.endsWith('s')) return snake;
  if (snake.endsWith('y')) return snake.slice(0, -1) + 'ies';
  return snake + 's';
}

function singularize(str: string): string {
  if (str.endsWith('ies')) return str.slice(0, -3) + 'y';
  if (str.endsWith('ses')) return str.slice(0, -2);
  if (str.endsWith('s') && !str.endsWith('ss')) return str.slice(0, -1);
  return str;
}

// --- FK Detection ---
const FK_PATTERNS = [/_id$/, /Id$/, /_ID$/];

function detectFK(colName: string, tables: string[]): { table: string; column: string } | undefined {
  for (const pattern of FK_PATTERNS) {
    if (pattern.test(colName)) {
      const base = colName.replace(/_id$/i, '').replace(/Id$/, '').replace(/_ID$/, '');
      const targetTable = toTableName(base);
      // Check if any known table matches
      const match = tables.find(t => t === targetTable || t === base || singularize(t) === base || t === toSnakeCase(base) + 's');
      if (match) return { table: match, column: 'id' };
      // Still likely a FK even if table not found
      return { table: targetTable, column: 'id' };
    }
  }
  return undefined;
}

// --- Main Analyzer ---
export function analyzeJSON(input: unknown): SchemaIR {
  const warnings: string[] = [];
  const tables: TableDef[] = [];
  const allRelationships: RelationshipDef[] = [];
  const allIndexes: IndexDef[] = [];

  // Normalize to array of objects
  let rootArray: Record<string, unknown>[];
  if (Array.isArray(input)) {
    if (input.length === 0) { warnings.push('Empty array provided'); return { tables: [], relationships: [], indexes: [], warnings }; }
    rootArray = input.filter(item => typeof item === 'object' && item !== null) as Record<string, unknown>[];
    if (rootArray.length === 0) { warnings.push('Array contains no objects'); return { tables: [], relationships: [], indexes: [], warnings }; }
  } else if (typeof input === 'object' && input !== null) {
    // Check if it's a single object with array values (multi-entity)
    const entries = Object.entries(input as Record<string, unknown>);
    const arrayEntries = entries.filter(([, v]) => Array.isArray(v) && v.length > 0 && typeof v[0] === 'object');
    if (arrayEntries.length > 0) {
      // Multi-entity JSON: { users: [...], orders: [...] }
      for (const [key, value] of arrayEntries) {
        const arr = value as Record<string, unknown>[];
        processTable(toTableName(key), arr, tables, warnings);
      }
    } else {
      rootArray = [input as Record<string, unknown>];
      processTable('items', rootArray, tables, warnings);
    }
  } else {
    warnings.push('Input must be a JSON object or array');
    return { tables: [], relationships: [], indexes: [], warnings };
  }

  // Detect and fix cross-table relationships
  const tableNames = tables.map(t => t.name);
  for (const table of tables) {
    for (const col of table.columns) {
      const fk = detectFK(col.name, tableNames);
      if (fk) {
        col.foreignKey = fk;
        col.index = true;
        
        // --- FIX: Match referenced column type ---
        const targetTable = tables.find(t => t.name === fk.table);
        if (targetTable) {
          const targetCol = targetTable.columns.find(c => c.name === fk.column);
          if (targetCol) {
            col.type = targetCol.type;
            col.pgType = targetCol.pgType === 'SERIAL' ? 'INT' : targetCol.pgType; // FK to SERIAL is INT
            col.mongoType = targetCol.mongoType;
            col.prismaType = targetCol.prismaType;
            col.maxLength = targetCol.maxLength;
          }
        }

        allRelationships.push({ type: 'belongsTo', from: `${table.name}.${col.name}`, to: `${fk.table}.${fk.column}`, via: col.name });
        allIndexes.push({ table: table.name, column: col.name, reason: 'Foreign key join optimization' });
      }
    }
  }

  return { tables, relationships: allRelationships, indexes: allIndexes, warnings };
}

function processTable(name: string, rows: Record<string, unknown>[], tables: TableDef[], warnings: string[]) {
  const keyValues: Record<string, unknown[]> = {};
  const nestedArrayKeys: Record<string, Record<string, unknown>[]> = {};
  const nestedObjectKeys: Record<string, Record<string, unknown>[]> = {};

  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        if (!nestedArrayKeys[key]) nestedArrayKeys[key] = [];
        nestedArrayKeys[key].push(...(value as Record<string, unknown>[]));
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!nestedObjectKeys[key]) nestedObjectKeys[key] = [];
        nestedObjectKeys[key].push(value as Record<string, unknown>);
      } else {
        if (!keyValues[key]) keyValues[key] = [];
        keyValues[key].push(value);
      }
    }
  }

  const columns: ColumnDef[] = [];
  const hasId = 'id' in keyValues || '_id' in keyValues;

  if (!hasId) {
    // Better default ID: integer SERIAL
    columns.push({
      name: 'id', type: 'integer', pgType: 'SERIAL', mongoType: 'ObjectId', prismaType: 'Int',
      nullable: false, unique: true, primaryKey: true, autoIncrement: true, index: false,
    });
  }

  for (const [key, values] of Object.entries(keyValues)) {
    const snakeKey = toSnakeCase(key);
    let typeInfo = inferType(values, snakeKey);
    const isPK = key === 'id' || key === '_id';

    // --- FIX: Upgrade string PKs to UUID with auto-generation ---
    // If the PK is a plain string (not already UUID), upgrade to UUID
    // so the database generates IDs automatically instead of requiring manual generation
    if (isPK && (typeInfo.type === 'string' || typeInfo.type === 'unknown')) {
      typeInfo = { type: 'uuid', pgType: 'UUID', mongoType: 'String', prismaType: 'String' };
    }

    const isUnique = isPK || typeInfo.type === 'email' || typeInfo.type === 'uuid';
    // Don't mark PK or unique columns for indexing — the DB already indexes those
    const shouldIndex = !isPK && !isUnique && (typeInfo.type === 'email' || typeInfo.type === 'date' || snakeKey.endsWith('_id'));
    const nullCount = values.filter(v => v === null || v === undefined).length;

    // Preserve defaults from inferType (counter defaults, date defaults)
    // Only override if inferType didn't already set a default
    let colDefault = typeInfo.default;
    if (!colDefault && typeInfo.type === 'date' && (snakeKey.includes('created') || snakeKey.includes('updated'))) {
      colDefault = 'NOW()';
    }

    columns.push({
      name: snakeKey,
      ...typeInfo,
      nullable: nullCount > 0,
      unique: isUnique,
      primaryKey: isPK,
      autoIncrement: isPK && typeInfo.type === 'integer',
      index: shouldIndex,
      default: colDefault,
    });
  }

  // --- FIX: Auto-inject lifecycle timestamps if missing ---
  const colNames = new Set(columns.map(c => c.name));
  if (!colNames.has('created_at')) {
    columns.push({
      name: 'created_at', type: 'date', pgType: 'TIMESTAMPTZ', mongoType: 'Date', prismaType: 'DateTime',
      nullable: false, unique: false, primaryKey: false, autoIncrement: false, index: false,
      default: 'NOW()',
    });
  }
  if (!colNames.has('updated_at')) {
    columns.push({
      name: 'updated_at', type: 'date', pgType: 'TIMESTAMPTZ', mongoType: 'Date', prismaType: 'DateTime',
      nullable: false, unique: false, primaryKey: false, autoIncrement: false, index: false,
      default: 'NOW()',
    });
  }

  // Only suggest indexes for columns that aren't already PK or UNIQUE (those are auto-indexed)
  const tableIndexes: IndexDef[] = columns
    .filter(c => c.index && !c.primaryKey && !c.unique)
    .map(c => ({ table: name, column: c.name, reason: c.type === 'email' ? 'Frequently queried field' : c.type === 'date' ? 'Timestamp range queries' : 'Foreign key join optimization' }));

  tables.push({ name, columns, indexes: tableIndexes, relationships: [] });

  // Process child tables
  const parentSingular = singularize(name);
  for (const [key, childRows] of Object.entries(nestedArrayKeys)) {
    const childTableName = toTableName(key);
    processTable(childTableName, childRows, tables, warnings);
    
    const childTable = tables.find(t => t.name === childTableName);
    if (childTable) {
      // Initial FK - will be type-synced in analyzeJSON pass
      const fkCol: ColumnDef = {
        name: `${parentSingular}_id`, type: 'integer', pgType: 'INT', mongoType: 'ObjectId', prismaType: 'Int',
        nullable: false, unique: false, primaryKey: false, autoIncrement: false, index: true,
        foreignKey: { table: name, column: 'id' },
      };
      childTable.columns.splice(1, 0, fkCol);
    }
  }

  for (const [key, objRows] of Object.entries(nestedObjectKeys)) {
    const childTableName = toTableName(key);
    processTable(childTableName, objRows, tables, warnings);

    const childTable = tables.find(t => t.name === childTableName);
    if (childTable) {
      // 1:1 relationship
      const fkCol: ColumnDef = {
        name: `${parentSingular}_id`, type: 'integer', pgType: 'INT', mongoType: 'ObjectId', prismaType: 'Int',
        nullable: false, unique: true, primaryKey: false, autoIncrement: false, index: true,
        foreignKey: { table: name, column: 'id' },
      };
      childTable.columns.splice(1, 0, fkCol);
    }
  }
}
