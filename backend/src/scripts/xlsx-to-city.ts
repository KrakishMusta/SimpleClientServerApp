import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const currentRoot = `src/modules/city/data/`;
const workbook = XLSX.readFile(currentRoot + 'cities.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet, {
  header: ['col0', 'emblem', 'name'], // первый столбец — col0, второй — emblem, третий — name
  range: 0,
  defval: null,
  blankrows: false,
});

console.log('ROWS RAW:', rows);
rows.forEach((r, i) => {
  const rowObj = r as Record<string, unknown>; // говорим TS, что r — объект
  console.log(i, Object.keys(rowObj), rowObj);
});

const cities = rows.map((row: any) => ({
  name: String(row.name).trim(),
  emblem: row.emblem ?? null,
}));

writeFileSync(currentRoot + 'cities.json', JSON.stringify(cities, null, 2));

console.log(`✔ ${cities.length} cities saved`);
