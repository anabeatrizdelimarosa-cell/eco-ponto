import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureAllScreens() {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 860 });

  console.log('Navegando para o sistema...');
  await page.goto('http://localhost:3011', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Mapa Interativo
  await page.screenshot({ path: path.join(screenshotDir, '01_mapa_interativo.png') });
  console.log('✓ 01_mapa_interativo.png capturado');

  // 2. Pontos de Coleta
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Pontos de Coleta'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '02_pontos_coleta.png') });
  console.log('✓ 02_pontos_coleta.png capturado');

  // 3. Meus Despachos
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Histórico'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '03_meus_despachos.png') });
  console.log('✓ 03_meus_despachos.png capturado');

  // 4. Registrar Despacho
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Registrar Despacho'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '04_registrar_despacho.png') });
  console.log('✓ 04_registrar_despacho.png capturado');

  // 5. Painel Administrativo - Usuários
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Painel Administrativo'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '05_painel_admin_usuarios.png') });
  console.log('✓ 05_painel_admin_usuarios.png capturado');

  // 6. Painel Administrativo - Ecopontos e IoT
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Ecopontos & Sensores IoT'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '06_painel_admin_ecopontos_iot.png') });
  console.log('✓ 06_painel_admin_ecopontos_iot.png capturado');

  // 7. Painel Administrativo - Preços e CO2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Preços & Fatores CO₂'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '07_painel_admin_precos.png') });
  console.log('✓ 07_painel_admin_precos.png capturado');

  // 8. Painel Administrativo - Auditoria de Cargas
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Auditoria de Cargas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '08_painel_admin_auditoria.png') });
  console.log('✓ 08_painel_admin_auditoria.png capturado');

  // 9. Guia de Descarte
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Guia de Descarte'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '09_guia_descarte.png') });
  console.log('✓ 09_guia_descarte.png capturado');

  // 10. Indicadores RO
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Indicadores RO'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '10_indicadores_ro.png') });
  console.log('✓ 10_indicadores_ro.png capturado');

  // 11. Campanhas
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Campanhas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '11_campanhas.png') });
  console.log('✓ 11_campanhas.png capturado');

  // 12. Ficha Centelha 3
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const btn = btns.find(b => b.textContent.includes('Ficha Centelha'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '12_ficha_centelha.png') });
  console.log('✓ 12_ficha_centelha.png capturado');

  // 13. Auth Portal - Login
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Entrar'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '13_auth_login.png') });
  console.log('✓ 13_auth_login.png capturado');

  // 14. Auth Portal - Cadastro
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Criar Conta'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '14_auth_cadastro.png') });
  console.log('✓ 14_auth_cadastro.png capturado');

  // 15. Auth Portal - Recuperar Senha
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Recuperar'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '15_auth_recuperar.png') });
  console.log('✓ 15_auth_recuperar.png capturado');

  await browser.close();
  console.log('Todas as 15 telas foram capturadas com sucesso!');
}

captureAllScreens().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
