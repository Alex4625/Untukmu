import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

function generateSql() {
  const db = new Database(path.join(process.cwd(), '.sqlite', 'local.db'));
  const tables = ['memories', 'letters', 'memory_cards', 'quiz_questions', 'plans', 'site_settings'];
  const sqlStatements: string[] = [];

  for (const table of tables) {
    const rows = db.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[];
    for (const row of rows) {
      const cols = Object.keys(row);
      const values = cols.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val.toString();
        if (typeof val === 'boolean') return val ? '1' : '0';
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      sqlStatements.push(
        `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${values.join(', ')});`
      );
    }
  }

  db.close();

  const outPath = path.join(process.cwd(), 'scripts', 'seed-remote-d1.sql');
  fs.writeFileSync(outPath, sqlStatements.join('\n'));
  console.log(`Generated ${sqlStatements.length} SQL statements in ${outPath}`);
}

generateSql();
