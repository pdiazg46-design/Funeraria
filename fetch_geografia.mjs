import fs from 'fs';
import https from 'https';
import path from 'path';

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function createGeografia() {
  try {
    const regiones = await fetchJson('https://apis.digital.gob.cl/dpa/regiones');
    const comunas = await fetchJson('https://apis.digital.gob.cl/dpa/comunas');

    const filePath = path.join(process.cwd(), 'src', 'data', 'geografia.ts');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let tsCode = `export interface Region { id: string; nombre: string; }\n`;
    tsCode += `export interface Comuna { id: string; nombre: string; regionId: string; }\n\n`;
    
    tsCode += `export const regionesChile: Region[] = [\n`;
    for (const r of regiones) {
      tsCode += `  { id: '${r.codigo}', nombre: '${r.nombre.toUpperCase().replace("'", "\\'")}' },\n`;
    }
    tsCode += `];\n\n`;

    tsCode += `export const comunasChile: Comuna[] = [\n`;
    for (const c of comunas) {
      if (!c.nombre) continue;
      tsCode += `  { id: '${c.codigo}', nombre: '${c.nombre.toUpperCase().replace("'", "\\'")}', regionId: '${c.codigo.substring(0, 2)}' },\n`;
    }
    tsCode += `];\n`;

    fs.writeFileSync(filePath, tsCode, 'utf-8');
    console.log('SUCCESS');
  } catch (err) {
    console.error(err);
  }
}

createGeografia();
