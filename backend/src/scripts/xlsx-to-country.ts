import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { ICounty } from 'src/modules/country/interfaces/country.interface';

const currentRoot = `src/modules/country/data/`;
const workbook = XLSX.readFile(currentRoot + 'countries.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows: ICounty[] = XLSX.utils.sheet_to_json<ICounty>(sheet, {
  header: ['name', 'eNname', 'code', 'countryCode'],
  range: 1, // пропускаем первую строку, если нет заголовков
  defval: null, // чтобы пустые ячейки были null
  blankrows: false,
});

console.log('ROWS RAW:', rows);
rows.forEach((r, i) => {
  const rowObj = r; // говорим TS, что r — объект
  console.log(i, Object.keys(rowObj), rowObj);
});

const countries = rows.map((row: ICounty) => ({
  name: String(row.name).trim(),
  eNname: String(row.eNname).trim(),
  code: String(row.code).trim(),
  countryCode: String(row.countryCode).trim(),
}));

writeFileSync(
  currentRoot + 'countries.json',
  JSON.stringify(countries, null, 2),
);

console.log(`✔ ${countries.length} cities saved`);
