import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'mrmango_db.json');

interface Row {
  [key: string]: any;
}

interface RunResult {
  changes: number;
  lastInsertRowid: number;
}

interface Statement {
  all(...params: any[]): Row[];
  get(...params: any[]): Row | undefined;
  run(...params: any[]): RunResult;
}

class PersistentDatabase {
  private tables: Map<string, Row[]> = new Map();
  private autoIncrements: Map<string, number> = new Map();
  private tableNames = [
    'products',
    'categories',
    'blog_posts',
    'faq_items',
    'contact_submissions',
    'orders',
    'newsletter_subscribers',
    'waitlist'
  ];

  constructor() {
    this.tableNames.forEach(name => {
      this.tables.set(name, []);
      this.autoIncrements.set(name, 1);
    });
    this.loadFromDisk();
  }

  loadFromDisk(): boolean {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data.tables) {
          for (const [name, rows] of Object.entries(data.tables)) {
            this.tables.set(name, Array.isArray(rows) ? (rows as Row[]) : []);
            const maxId = (rows as Row[]).reduce((max, r) => (typeof r.id === 'number' && r.id > max ? r.id : max), 0);
            this.autoIncrements.set(name, maxId + 1);
          }
          console.log(`💾 Loaded database from disk (${DB_FILE})`);
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to load database from disk, using fresh state:', err);
    }
    return false;
  }

  saveToDisk(): void {
    try {
      const exportObj: Record<string, any> = {
        tables: {},
        updatedAt: new Date().toISOString()
      };
      for (const [name, rows] of this.tables.entries()) {
        exportObj.tables[name] = rows;
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(exportObj, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  exec(_sql: string): void {
    // Schema creation no-op for JSON store
  }

  prepare(sql: string): Statement {
    const self = this;
    return {
      all(...params: any[]): Row[] {
        return self.executeQuery(sql, params);
      },
      get(...params: any[]): Row | undefined {
        const results = self.executeQuery(sql, params);
        return results[0];
      },
      run(...params: any[]): RunResult {
        return self.executeMutation(sql, params);
      }
    };
  }

  getTable(name: string): Row[] {
    return this.tables.get(name) || [];
  }

  private getTableName(sql: string): string {
    const normalized = sql.replace(/\s+/g, ' ').trim().toLowerCase();

    let match = normalized.match(/insert\s+into\s+(\w+)/);
    if (match) return match[1];

    match = normalized.match(/from\s+(\w+)/);
    if (match) return match[1];

    match = normalized.match(/update\s+(\w+)/);
    if (match) return match[1];

    match = normalized.match(/delete\s+from\s+(\w+)/);
    if (match) return match[1];

    return '';
  }

  private executeQuery(sql: string, params: any[]): Row[] {
    const tableName = this.getTableName(sql);
    const rows = this.tables.get(tableName) || [];
    const normalized = sql.replace(/\s+/g, ' ').trim();

    // Handle COUNT(*) queries
    if (normalized.toLowerCase().includes('select count(*)')) {
      return [{ count: rows.length }];
    }

    // Handle SELECT 1 (existence check)
    if (normalized.toLowerCase().includes('select 1')) {
      const filtered = this.applyWhere(rows, normalized, params);
      return filtered.length > 0 ? [{ '1': 1 }] : [];
    }

    // Apply WHERE clause
    let result = this.applyWhere(rows, normalized, params);

    // Apply ORDER BY
    result = this.applyOrderBy(result, normalized);

    // Apply LIMIT
    const limitMatch = normalized.toLowerCase().match(/limit\s+(\d+)/);
    if (limitMatch) {
      result = result.slice(0, parseInt(limitMatch[1]));
    }

    return result.map(r => ({ ...r }));
  }

  private applyWhere(rows: Row[], sql: string, params: any[]): Row[] {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    const lowerSql = normalized.toLowerCase();

    const whereIdx = lowerSql.indexOf('where');
    if (whereIdx === -1) return [...rows];

    let whereClause = normalized.substring(whereIdx + 5);
    const orderIdx = whereClause.toLowerCase().indexOf(' order ');
    if (orderIdx !== -1) whereClause = whereClause.substring(0, orderIdx);
    const limitIdx = whereClause.toLowerCase().indexOf(' limit ');
    if (limitIdx !== -1) whereClause = whereClause.substring(0, limitIdx);

    whereClause = whereClause.trim();
    if (!whereClause) return [...rows];

    const conditions = whereClause.split(/\s+AND\s+/i);
    let paramCursor = 0;

    const predicates: ((row: Row) => boolean)[] = [];

    for (const cond of conditions) {
      const trimmed = cond.trim();
      if (trimmed === '1=1') continue;

      // Handle grouped OR: (name LIKE ? OR flavor LIKE ? OR description LIKE ?)
      const orGroupMatch = trimmed.match(/^\((.+?)\)$/);
      if (orGroupMatch) {
        const orParts = orGroupMatch[1].split(/\s+OR\s+/i);
        const orPredicates: ((row: Row) => boolean)[] = [];
        for (const part of orParts) {
          const m = part.trim().match(/(\w+)\s+LIKE\s+\?/i);
          if (m) {
            const col = m[1];
            const pattern = String(params[paramCursor++] ?? '');
            const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '\\*').replace(/\?/g, '\\?');
            const regexPattern = escaped.replace(/%/g, '.*').replace(/_/g, '.');
            const regex = new RegExp(`^${regexPattern}$`, 'i');
            orPredicates.push(row => {
              const val = row[col];
              return val != null && regex.test(String(val));
            });
          }
        }
        predicates.push(row => orPredicates.some(p => p(row)));
        continue;
      }

      // Handle single LIKE: col LIKE ?
      const likeMatch = trimmed.match(/(\w+)\s+LIKE\s+\?/i);
      if (likeMatch) {
        const col = likeMatch[1];
        const pattern = String(params[paramCursor++] ?? '');
        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '\\*').replace(/\?/g, '\\?');
        const regexPattern = escaped.replace(/%/g, '.*').replace(/_/g, '.');
        const regex = new RegExp(`^${regexPattern}$`, 'i');
        predicates.push(row => {
          const val = row[col];
          return val != null && regex.test(String(val));
        });
        continue;
      }

      // Handle col = ?
      const eqMatch = trimmed.match(/(\w+)\s*=\s*\?/);
      if (eqMatch) {
        const col = eqMatch[1];
        const expected = params[paramCursor++];
        predicates.push(row => {
          if (row[col] === expected) return true;
          if (row[col] == expected) return true;
          if (typeof row[col] === 'string' && typeof expected === 'string') {
            return row[col].toLowerCase() === expected.toLowerCase();
          }
          return false;
        });
        continue;
      }

      // Handle col = literal (e.g. featured = 1)
      const eqValMatch = trimmed.match(/(\w+)\s*=\s*(\d+|'[^']*'|"[^"]*")/);
      if (eqValMatch) {
        const col = eqValMatch[1];
        let valStr = eqValMatch[2];
        if (valStr.startsWith("'") || valStr.startsWith('"')) {
          valStr = valStr.slice(1, -1);
          predicates.push(row => String(row[col]) === valStr);
        } else {
          const numVal = parseInt(valStr, 10);
          predicates.push(row => row[col] == numVal);
        }
        continue;
      }
    }

    if (predicates.length === 0) return [...rows];

    return rows.filter(row => predicates.every(pred => pred(row)));
  }

  private applyOrderBy(rows: Row[], sql: string): Row[] {
    const lowerSql = sql.toLowerCase();
    const orderMatch = lowerSql.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?(?:\s*,\s*(\w+)(?:\s+(asc|desc))?)?/);
    if (!orderMatch) return rows;

    const result = [...rows];
    const col1 = orderMatch[1];
    const dir1 = (orderMatch[2] || 'asc').toLowerCase();

    result.sort((a, b) => {
      let aVal = a[col1];
      let bVal = b[col1];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return dir1 === 'desc' ? -cmp : cmp;
      }

      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return dir1 === 'desc' ? -cmp : cmp;
    });

    return result;
  }

  private executeMutation(sql: string, params: any[]): RunResult {
    const tableName = this.getTableName(sql);
    const normalized = sql.replace(/\s+/g, ' ').trim();
    const lowerSql = normalized.toLowerCase();

    let result: RunResult = { changes: 0, lastInsertRowid: 0 };

    if (lowerSql.startsWith('insert')) {
      result = this.executeInsert(tableName, normalized, params);
    } else if (lowerSql.startsWith('update')) {
      result = this.executeUpdate(tableName, normalized, params);
    } else if (lowerSql.startsWith('delete')) {
      result = this.executeDelete(tableName, normalized, params);
    }

    if (result.changes > 0) {
      this.saveToDisk();
    }

    return result;
  }

  private executeInsert(tableName: string, sql: string, params: any[]): RunResult {
    const colMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
    if (!colMatch) return { changes: 0, lastInsertRowid: 0 };

    const columns = colMatch[1].split(',').map(c => c.trim());
    const row: Row = {};

    const id = this.autoIncrements.get(tableName) || 1;
    row.id = id;
    this.autoIncrements.set(tableName, id + 1);

    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

    columns.forEach((col, i) => {
      row[col] = flatParams[i] !== undefined ? flatParams[i] : null;
    });

    if (!row.createdAt) {
      row.createdAt = new Date().toISOString();
    }
    if (tableName === 'blog_posts' && !row.publishedAt) {
      row.publishedAt = new Date().toISOString();
    }
    if (tableName === 'orders' && !row.status) {
      row.status = 'placed';
    }
    if (tableName === 'contact_submissions' && !row.status) {
      row.status = 'new';
    }
    if (tableName === 'products' && row.inStock === undefined) {
      row.inStock = 1;
    }

    let table = this.tables.get(tableName);
    if (!table) {
      table = [];
      this.tables.set(tableName, table);
    }
    table.push(row);

    return { changes: 1, lastInsertRowid: id };
  }

  private executeUpdate(tableName: string, sql: string, params: any[]): RunResult {
    const table = this.tables.get(tableName) || [];
    const lowerSql = sql.toLowerCase();

    // Parse SET clause: UPDATE table SET col1 = ?, col2 = ? WHERE ...
    const setIdx = lowerSql.indexOf('set');
    if (setIdx === -1) return { changes: 0, lastInsertRowid: 0 };

    const whereIdx = lowerSql.indexOf('where');
    const setPart = whereIdx !== -1 ? sql.substring(setIdx + 3, whereIdx).trim() : sql.substring(setIdx + 3).trim();

    const setAssignments = setPart.split(',').map(s => s.trim());
    const updateEntries: { col: string; isParam: boolean; literalVal?: any }[] = [];

    let paramIndex = 0;
    setAssignments.forEach(assign => {
      const match = assign.match(/(\w+)\s*=\s*(.+)/);
      if (match) {
        const col = match[1];
        const valExpr = match[2].trim();
        if (valExpr === '?') {
          updateEntries.push({ col, isParam: true });
          paramIndex++;
        } else {
          let litVal: any = valExpr;
          if (litVal.startsWith("'") && litVal.endsWith("'")) {
            litVal = litVal.slice(1, -1);
          } else if (!isNaN(Number(litVal))) {
            litVal = Number(litVal);
          }
          updateEntries.push({ col, isParam: false, literalVal: litVal });
        }
      }
    });

    const whereParams = params.slice(paramIndex);
    const setParams = params.slice(0, paramIndex);

    let changedCount = 0;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const matches = this.applyWhere([row], sql, whereParams);
      if (matches.length > 0) {
        let setParamCursor = 0;
        updateEntries.forEach(entry => {
          if (entry.isParam) {
            row[entry.col] = setParams[setParamCursor++];
          } else {
            row[entry.col] = entry.literalVal;
          }
        });
        row.updatedAt = new Date().toISOString();
        changedCount++;
      }
    }

    return { changes: changedCount, lastInsertRowid: 0 };
  }

  private executeDelete(tableName: string, sql: string, params: any[]): RunResult {
    const table = this.tables.get(tableName) || [];
    const before = table.length;
    const keep = table.filter(row => {
      const toDelete = this.applyWhere([row], sql, params);
      return toDelete.length === 0;
    });
    this.tables.set(tableName, keep);
    return { changes: before - keep.length, lastInsertRowid: 0 };
  }
}

const db = new PersistentDatabase();

import { seedDatabase } from './seed';

export function initializeDb(): Promise<void> {
  return new Promise((resolve) => {
    const loaded = db.loadFromDisk();
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number } | undefined;
    if (!loaded || !productsCount || productsCount.count === 0) {
      seedDatabase(db);
      db.saveToDisk();
      console.log('✅ Seeded database and saved snapshot to disk');
    } else {
      console.log(`✅ Loaded ${productsCount.count} products from persistent database`);
    }
    resolve();
  });
}

export default db;
