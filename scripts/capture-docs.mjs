#!/usr/bin/env node
// Re-captures every screenshot used by /panduan from a running warung-app.
//
//   cd platform/warung-app && php artisan reload:db --demo   (fresh demo data)
//   cd platform/warung-web && npm run capture-docs [-- topic ...]
//
// Needs warung-app serving at APP_URL (default http://localhost:8000) and its
// checkout at APP_DIR (default ../warung-app) for `php artisan tinker`.
// Headless Chromium, desktop viewport, deviceScaleFactor 2 so zoom stays crisp.
// Output: public/panduan/img/<topic>/<nn>-<slug>.webp
import { chromium } from 'playwright';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = process.env.APP_URL ?? 'http://localhost:8000';
const APP_DIR = resolve(ROOT, process.env.APP_DIR ?? '../warung-app');
const OUT = resolve(ROOT, 'public/panduan/img');
const PASSWORD = 'password';

const tinker = (code) =>
  execFileSync('php', ['artisan', 'tinker', '--execute', code], { cwd: APP_DIR, encoding: 'utf8' }).trim();

// Demo users are seeded in English; the guide shows the Malay UI.
const malay = (email) => tinker(`App\\Models\\User::where('email','${email}')->update(['preferred_locale'=>'ms']);`);

// The debug bar and Livewire's dev toasts are not part of the product.
const HIDE_DEV = `.phpdebugbar, .phpdebugbar-openhandler, .phpdebugbar-openhandler-overlay { display: none !important; }`;

let browser;

const pages = new Set();
async function session(email) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    locale: 'ms-MY',
    timezoneId: 'Asia/Kuala_Lumpur',
  });
  await ctx.addInitScript((css) => {
    try { localStorage.setItem('flux.appearance', 'light'); } catch {}
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = css;
      document.head.append(s);
    });
  }, HIDE_DEV);
  const page = await ctx.newPage();
  pages.add(page);
  if (email) {
    malay(email);
    await page.goto(`${APP}/login`);
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', PASSWORD);
    await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/login')), page.click('button[type=submit]')]);
  }
  return page;
}

async function go(page, path) {
  await page.goto(APP + path, { waitUntil: 'networkidle' });
  await settle(page);
}

async function settle(page, ms = 600) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(ms);
}

// Save one step's screenshot. `mark` outlines the control the step talks about.
async function shot(page, topic, name, { mark, full = false } = {}) {
  const marked = mark ? await mark.first().elementHandle({ timeout: 5000 }).catch(() => null) : null;
  if (marked) {
    await marked.scrollIntoViewIfNeeded().catch(() => {});
    await marked.evaluate((el) => {
      el.dataset.docMark = el.style.outline || ' ';
      el.style.outline = '3px solid #F59E0B';
      el.style.outlineOffset = '3px';
    });
  }
  const png = await page.screenshot({ fullPage: full, animations: 'disabled', caret: 'hide' });
  if (marked) {
    await marked.evaluate((el) => {
      el.style.outline = el.dataset.docMark.trim();
      el.style.outlineOffset = '';
      delete el.dataset.docMark;
    }).catch(() => {});
  }
  mkdirSync(resolve(OUT, topic), { recursive: true });
  const file = resolve(OUT, topic, `${name}.webp`);
  await sharp(png).webp({ quality: 82 }).toFile(file);
  console.log(`  ${topic}/${name}.webp`);
}

// ─── 1–3: a brand-new merchant ───────────────────────────────────────────────
async function newMerchant() {
  const email = `panduan+${Date.now()}@warung.my`;
  const page = await session();

  // 1. Daftar
  await go(page, '/register?plan=free');
  await shot(page, 'daftar', '01-borang-daftar');
  await page.fill('input[name=name]', 'Mak Jah');
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', 'R4hsia-Warung!');
  await page.fill('input[name=password_confirmation]', 'R4hsia-Warung!');
  await shot(page, 'daftar', '02-isi-borang', { mark: page.locator('[data-test=register-user-button]') });
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/register')), page.click('[data-test=register-user-button]')]);
  await settle(page);
  await shot(page, 'daftar', '03-semak-email');

  // The verification email itself, rendered by the app.
  const mail = tinker(
    `$u = App\\Models\\User::where('email','${email}')->first(); App::setLocale('ms');` +
      ` echo (new Illuminate\\Auth\\Notifications\\VerifyEmail)->toMail($u)->render();`,
  );
  const mailFile = resolve(tmpdir(), 'warung-panduan-email.html');
  writeFileSync(mailFile, mail);
  await page.goto('file://' + mailFile);
  await shot(page, 'daftar', '04-email-pengesahan', { mark: page.locator('a.button, a[class*=button]') });

  const link = tinker(
    `$u = App\\Models\\User::where('email','${email}')->first();` +
      ` echo URL::temporarySignedRoute('verification.link', now()->addHour(), ['user'=>$u->uuid,'hash'=>sha1($u->email)]);`,
  );

  // 2. Setup kedai
  await go(page, new URL(link).pathname + new URL(link).search);
  await shot(page, 'setup-kedai', '01-nama-kedai');
  await page.fill('input[wire\\:model=name]', 'Warung Mak Jah');
  await shot(page, 'setup-kedai', '02-isi-nama', { mark: page.getByRole('button', { name: 'Seterusnya' }) });
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await settle(page);
  await shot(page, 'setup-kedai', '03-pilih-menu');
  await page.getByRole('radio').first().click();
  await settle(page, 300);
  await shot(page, 'setup-kedai', '04-menu-dipilih', { mark: page.getByRole('radio').first() });
  await page.getByRole('radio', { name: /Mula kosong/ }).click();
  await settle(page, 300);
  await shot(page, 'setup-kedai', '05-mula-kosong', { mark: page.getByRole('button', { name: 'Buka kedai saya' }) });
  await Promise.all([page.waitForURL(/\/pos/), page.getByRole('button', { name: 'Buka kedai saya' }).click()]);
  await settle(page, 1200);

  // 3. Jualan pertama
  await shot(page, 'jualan-pertama', '01-panduan-jualan-pertama');
  const guide = page.locator('form', { has: page.getByRole('button', { name: 'Tambah', exact: true }) });
  await guide.locator('input').nth(0).fill('Nasi Lemak Biasa');
  await guide.locator('input').nth(1).fill('3.50');
  await shot(page, 'jualan-pertama', '02-tambah-hidangan', { mark: guide });
  await guide.getByRole('button', { name: 'Tambah', exact: true }).click();
  await settle(page, 1000);
  await shot(page, 'jualan-pertama', '03-hidangan-ditambah');
  await page.getByRole('button', { name: 'Tambah Nasi Lemak Biasa' }).click();
  await settle(page, 500);
  await shot(page, 'jualan-pertama', '04-kuantiti', { mark: page.getByRole('button', { name: 'Tambah ke Troli' }) });
  await page.getByRole('button', { name: 'Tambah ke Troli' }).click();
  await settle(page, 500);
  await shot(page, 'jualan-pertama', '05-dalam-troli', { mark: page.getByRole('button', { name: 'Bayar' }) });
  await page.getByRole('button', { name: 'Bayar' }).first().click();
  await settle(page, 800);
  await shot(page, 'jualan-pertama', '06-bayaran', { mark: page.getByRole('button', { name: 'Sahkan Pesanan' }) });
  await page.getByRole('button', { name: 'Sahkan Pesanan' }).click();
  await settle(page, 1500);
  await shot(page, 'jualan-pertama', '07-pesanan-selesai');
  // "Lihat Resit" is an Alpine-bound link; follow the URL the till holds.
  await page.goto(await page.evaluate(() => window.Alpine.store('pos').receiptData.receiptUrl), { waitUntil: 'networkidle' });
  await settle(page, 600);
  await shot(page, 'jualan-pertama', '08-resit');
  await go(page, '/pos');
  await shot(page, 'jualan-pertama', '09-jualan-pertama-siap');

  // 9. Pelan — a new shop starts on Percuma.
  await go(page, '/billing');
  await shot(page, 'pelan-bayaran', '01-pelan-percuma');
  await shot(page, 'pelan-bayaran', '02-pilih-pelan', { mark: page.getByRole('button', { name: 'Bayar 1 bulan' }).first() });
  // Free has one seat: inviting a cashier is refused with the reason.
  await go(page, '/organization/settings/staff');
  await page.getByRole('button', { name: 'Jemput Kakitangan' }).first().click();
  await settle(page, 500);
  await page.fill('input[wire\\:model=name]', 'Adik Mak Jah');
  await page.fill('input[wire\\:model=email]', `adik+${Date.now()}@warung.my`);
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await settle(page, 800);
  await shot(page, 'pelan-bayaran', '03-had-pelan');

  await page.context().close();
}

// POS: tap a dish, pick a variant if asked, add to cart.
async function addToCart(page, name, variant) {
  await page.getByRole('button', { name: `Tambah ${name}`, exact: true }).click();
  await settle(page, 400);
  if (variant) {
    await page.locator('button:visible', { has: page.locator(`span:text-is("${variant}")`) }).first().click();
    await settle(page, 300);
  }
  await page.getByRole('button', { name: 'Tambah ke Troli' }).click();
  await settle(page, 300);
}

async function checkout(page, { takeaway = false, table, pax } = {}) {
  await page.getByRole('button', { name: 'Bayar', exact: true }).first().click();
  await settle(page, 500);
  if (takeaway) await page.getByRole('button', { name: 'Bungkus' }).click();
  if (table) await page.getByPlaceholder('cth: 5').fill(String(table));
  if (pax) await page.getByPlaceholder('cth: 2').fill(String(pax));
}

// Confirm payment and get back to an empty till, whichever success dialog shows.
async function confirmOrder(page) {
  // The payment modal re-renders as the order lands, so Playwright can miss
  // the click settling; the success dialog below is the real check.
  await page.getByRole('button', { name: 'Sahkan Pesanan' }).click({ timeout: 5000 }).catch(() => {});
  await page.getByRole('button', { name: /^(OK|Pesanan Baru)$/ }).first().waitFor({ timeout: 15000 });
  await settle(page, 1200);
  // Two dialogs can stack here (receipt modal over a "Berjaya" alert): top one first.
  for (const name of ['Pesanan Baru', 'OK']) {
    const b = page.getByRole('button', { name, exact: true });
    if (await b.isVisible().catch(() => false)) {
      await b.click({ timeout: 5000 }).catch(() => {});
      await settle(page, 400);
    }
  }
}

const ownerOrg = (email) => `App\\Models\\User::where('email','${email}')->value('organization_id')`;
const productUuid = (email, name) =>
  tinker(`echo App\\Models\\Product::withoutGlobalScopes()->where('organization_id', ${ownerOrg(email)})->where('name','${name}')->value('uuid');`);

// ─── 3b. Jualan harian (variant, notes, table) ───────────────────────────────
// ─── 4. Menu & produk ────────────────────────────────────────────────────────
async function menu() {
  const page = await session('pakali@warung.pro');
  // Re-runnable: drop what a previous run added, nothing sold out.
  const org = ownerOrg('pakali@warung.pro');
  tinker(`App\\Models\\ProductOutlet::withoutGlobalScopes()->where('organization_id', ${org})->update(['is_sold_out'=>false]);`);
  tinker(`App\\Models\\Product::withoutGlobalScopes()->where('organization_id', ${org})->where('name','Cendol')->get()->each->forceDelete();` +
    ` App\\Models\\Category::withoutGlobalScopes()->where('organization_id', ${org})->where('name','Pencuci Mulut')->get()->each->forceDelete();`);
  await go(page, '/inventory/categories');
  await shot(page, 'menu-produk', '01-kategori', { mark: page.getByRole('button', { name: 'Tambah Kategori' }).first() });
  await page.getByRole('button', { name: 'Tambah Kategori' }).first().click();
  await settle(page, 500);
  await page.fill('input[wire\\:model=name]', 'Pencuci Mulut');
  await shot(page, 'menu-produk', '02-tambah-kategori', { mark: page.getByRole('button', { name: 'Simpan' }) });
  await page.getByRole('button', { name: 'Simpan' }).click();
  await settle(page, 800);

  await go(page, '/inventory/products');
  await shot(page, 'menu-produk', '03-senarai-produk', { mark: page.getByRole('link', { name: 'Tambah Produk' }).first() });
  await go(page, '/inventory/products/create');
  await page.fill('input[wire\\:model=name]', 'Cendol');
  await page.locator('select[wire\\:model=category_id], [wire\\:model=category_id] select').first().selectOption({ label: 'Pencuci Mulut' }).catch(() => {});
  await page.fill('input[wire\\:model=base_price]', '4.00');
  await page.locator('input[type=checkbox][wire\\:model\\.live=has_variants], [wire\\:model\\.live=has_variants]').first().click();
  await settle(page, 500);
  await shot(page, 'menu-produk', '04-produk-baharu');
  await page.getByRole('button', { name: /Tambah Variasi/ }).click().catch(() => {});
  await settle(page, 300);
  await page.fill('input[wire\\:model="variants.0.name"]', 'Biasa').catch(() => {});
  await page.fill('input[wire\\:model="variants.0.price"]', '4.00').catch(() => {});
  await page.getByRole('button', { name: /Tambah Variasi/ }).click().catch(() => {});
  await settle(page, 300);
  await page.fill('input[wire\\:model="variants.1.name"]', 'Pulut').catch(() => {});
  await page.fill('input[wire\\:model="variants.1.price"]', '5.00').catch(() => {});
  await shot(page, 'menu-produk', '05-variasi', { mark: page.getByText('Variasi').first() });
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await settle(page, 1000);

  // Sold out: tick the dish, then "Tanda habis".
  await go(page, '/inventory/products');
  const nasiLemak = productUuid('pakali@warung.pro', 'Air Sirap');
  await page.locator(`[value="${nasiLemak}"]`).first().click();
  await settle(page, 500);
  await shot(page, 'menu-produk', '06-tanda-habis', { mark: page.getByRole('button', { name: 'Tanda habis' }) });
  await page.getByRole('button', { name: 'Tanda habis' }).click();
  await settle(page, 800);
  await go(page, '/pos');
  await shot(page, 'menu-produk', '07-habis-di-pos', { mark: page.locator('div', { hasText: 'Air Sirap' }).filter({ hasText: 'Habis' }).last() });
  // Put it back for the other topics.
  await go(page, '/inventory/products');
  await page.locator(`[value="${nasiLemak}"]`).first().click();
  await settle(page, 400);
  await page.getByRole('button', { name: 'Ada stok semula' }).click();
  await settle(page, 600);
  await page.context().close();
}

// ─── 5. Stok ─────────────────────────────────────────────────────────────────
async function stock() {
  const page = await session('pakali@warung.pro');
  const org = ownerOrg('pakali@warung.pro');
  tinker(`App\\Models\\Product::withoutGlobalScopes()->where('organization_id', ${org})->whereIn('name',['Donut','Kuih Lapis'])->update(['track_stock'=>true,'stock_quantity'=>6]);`);
  tinker(`App\\Models\\Product::withoutGlobalScopes()->where('organization_id', ${org})->where('name','Karipap')->update(['track_stock'=>false,'stock_quantity'=>0]);`);

  await go(page, `/inventory/products/${productUuid('pakali@warung.pro', 'Karipap')}/edit`);
  await page.locator('[wire\\:model\\.live=track_stock]').first().click();
  await settle(page, 400);
  await page.fill('input[wire\\:model=stock_quantity]', '40');
  await shot(page, 'stok', '01-jejak-stok', { mark: page.locator('input[wire\\:model=stock_quantity]') });
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await settle(page, 1000);

  await go(page, '/inventory/stock');
  await shot(page, 'stok', '02-senarai-stok');
  await go(page, `/inventory/stock/${productUuid('pakali@warung.pro', 'Karipap')}/adjust`);
  await page.locator('select[wire\\:model=type], [wire\\:model=type] select').first().selectOption({ index: 0 }).catch(() => {});
  await page.fill('input[wire\\:model=quantity]', '20');
  await page.fill('textarea[wire\\:model=reason]', 'Stok pagi dari pembekal');
  await shot(page, 'stok', '03-laras-stok', { mark: page.getByRole('button', { name: 'Simpan' }) });
  await page.getByRole('button', { name: 'Simpan' }).click();
  await settle(page, 1000);
  await go(page, `/inventory/stock/${productUuid('pakali@warung.pro', 'Karipap')}/adjust`);
  await shot(page, 'stok', '04-sejarah-pelarasan');
  await page.context().close();
}

// ─── 6. Meja & KDS ───────────────────────────────────────────────────────────
async function tablesKds() {
  const page = await session('pakali@warung.pro');
  const org = ownerOrg('pakali@warung.pro');
  // Seeded history leaves every past item "pending"; clear it so the kitchen
  // screen shows only today's tickets, as it would in a real shop.
  tinker(`App\\Models\\OrderItem::withoutGlobalScopes()->whereHas('order', fn ($q) => $q->withoutGlobalScopes()->where('organization_id', ${org}))->update(['status'=>'served']);`);

  // Re-runnable: start from the seeded "no tables" state.
  tinker(`App\\Models\\Table::withoutGlobalScopes()->where('organization_id', ${org})->forceDelete();`);
  await go(page, '/inventory/tables');
  await shot(page, 'meja-kds', '00-tiada-meja', { mark: page.getByRole('button', { name: 'Tambah Meja' }).first() });
  await page.getByRole('button', { name: 'Tambah Meja' }).first().click();
  await settle(page, 500);
  await page.fill('input[wire\\:model=name]', 'Meja 1');
  await page.fill('input[wire\\:model=number]', '1');
  await page.fill('input[wire\\:model=capacity]', '4');
  await page.fill('input[wire\\:model=zone]', 'Dalam');
  await shot(page, 'meja-kds', '01-tambah-meja', { mark: page.getByRole('button', { name: 'Simpan' }) });
  await page.getByRole('button', { name: 'Simpan' }).click();
  await settle(page, 800);
  for (const [n, zone] of [[2, 'Dalam'], [3, 'Dalam'], [4, 'Luar'], [5, 'Luar']]) {
    await page.getByRole('button', { name: 'Tambah Meja' }).first().click();
    await settle(page, 400);
    await page.fill('input[wire\\:model=name]', `Meja ${n}`);
    await page.fill('input[wire\\:model=number]', String(n));
    await page.fill('input[wire\\:model=capacity]', '4');
    await page.fill('input[wire\\:model=zone]', zone);
    await page.getByRole('button', { name: 'Simpan' }).click();
    await settle(page, 600);
  }
  await go(page, '/inventory/tables');
  await shot(page, 'meja-kds', '02-senarai-meja');

  await go(page, '/pos');
  await addToCart(page, 'Roti Canai', 'Telur');
  await addToCart(page, 'Teh', 'Teh Tarik');
  await checkout(page, { table: 3, pax: 2 });
  await shot(page, 'meja-kds', '03-pesanan-meja', { mark: page.getByPlaceholder('cth: 5') });
  await confirmOrder(page);
  await addToCart(page, 'Mee Goreng');
  await addToCart(page, 'Milo', 'Milo Ais');
  await checkout(page, { takeaway: true });
  await confirmOrder(page);

  await go(page, '/kds');
  await shot(page, 'meja-kds', '04-paparan-dapur');
  await page.getByRole('button', { name: 'Mula', exact: true }).first().click();
  await settle(page, 800);
  await shot(page, 'meja-kds', '05-mula-masak', { mark: page.getByRole('button', { name: 'Siap', exact: true }).first() });
  await page.getByRole('button', { name: 'Tandakan Semua Siap' }).first().click();
  await settle(page, 800);
  await shot(page, 'meja-kds', '06-semua-siap');
  await page.context().close();
}

// ─── 7. Staf & cawangan ──────────────────────────────────────────────────────
async function staffOutlets() {
  const page = await session('weiming@kopisinga.my');
  await go(page, '/organization/settings/staff');
  await shot(page, 'staf-cawangan', '01-senarai-staf', { mark: page.getByRole('button', { name: 'Jemput Kakitangan' }).first() });
  await page.getByRole('button', { name: 'Jemput Kakitangan' }).first().click();
  await settle(page, 500);
  await page.fill('input[wire\\:model=name]', 'Lim Mei Ling');
  await page.fill('input[wire\\:model=email]', 'meiling@kopisinga.my');
  await page.getByRole('checkbox', { name: /Juruwang|Cashier/ }).first().check().catch(() => {});
  await shot(page, 'staf-cawangan', '02-jemput-juruwang');

  await go(page, '/organization/settings/outlets');
  await shot(page, 'staf-cawangan', '03-senarai-cawangan', { mark: page.getByRole('button', { name: 'Cawangan Baharu' }).first() });
  await page.getByRole('button', { name: 'Cawangan Baharu' }).first().click();
  await settle(page, 500);
  await page.fill('input[wire\\:model=name]', 'Kopi Singa Shah Alam');
  await page.fill('input[wire\\:model=address]', 'Seksyen 13, Shah Alam');
  await shot(page, 'staf-cawangan', '04-cawangan-baharu');

  await go(page, '/dashboard');
  const switcher = page.locator('[data-tippy-content]').filter({ hasText: /Kopi Singa|Damansara|Subang|Bangsar/ }).first();
  await switcher.click();
  await settle(page, 500);
  await shot(page, 'staf-cawangan', '05-tukar-cawangan');
  await page.context().close();
}

// ─── 8. Pesanan & resit ──────────────────────────────────────────────────────
async function ordersReceipts() {
  const page = await session('pakali@warung.pro');
  await go(page, '/orders');
  await shot(page, 'pesanan-resit', '01-senarai-pesanan');
  await go(page, '/pos/orders');
  await shot(page, 'pesanan-resit', '02-pesanan-hari-ini');
  await page.locator('a[href*="/receipt/"]').first().click();
  await settle(page, 1000);
  await shot(page, 'pesanan-resit', '03-resit');
  await shot(page, 'pesanan-resit', '04-kongsi-resit', { mark: page.getByPlaceholder('cth: 60123456789') });
  const uuid = new URL(page.url()).pathname.split('/').pop();
  const g = await session();
  await go(g, `/r/${uuid}`);
  await shot(g, 'pesanan-resit', '05-resit-pelanggan');
  await g.context().close();
  await page.context().close();
}

// ─── 9. Pelan & bayaran (paid plan) ──────────────────────────────────────────
async function billing() {
  const page = await session('pakali@warung.pro');
  await go(page, '/billing');
  await shot(page, 'pelan-bayaran', '04-pelan-pro', { mark: page.getByRole('button', { name: 'Sambung 1 bulan' }) });
  await page.mouse.wheel(0, 2000);
  await settle(page, 400);
  await shot(page, 'pelan-bayaran', '05-sejarah-bayaran');
  await page.context().close();
}

// ─── 10. PWA & offline ───────────────────────────────────────────────────────
async function pwa() {
  const page = await session('siti@warung.pro');
  await go(page, '/pos');
  // Chrome fires beforeinstallprompt only for a real install-eligible origin;
  // replay it so the banner the cashier sees is shown.
  await page.evaluate(() => {
    const e = new Event('beforeinstallprompt');
    e.prompt = () => {};
    e.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: e }));
  });
  await settle(page, 400);
  await shot(page, 'pwa-offline', '01-pasang-app', { mark: page.getByRole('button', { name: 'Pasang', exact: true }) });
  await page.context().setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await settle(page, 400);
  await addToCart(page, 'Kopi', 'Kopi O');
  await shot(page, 'pwa-offline', '02-luar-talian');
  await checkout(page, { takeaway: true });
  await page.getByRole('button', { name: 'Sahkan Pesanan' }).click();
  await settle(page, 1200);
  await shot(page, 'pwa-offline', '03-jual-tanpa-internet');
  await page.context().setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await settle(page, 400);
  await page.context().close();
}

const TOPICS = {
  'new-merchant': newMerchant,
  menu,
  stock,
  'tables-kds': tablesKds,
  'staff-outlets': staffOutlets,
  'orders-receipts': ordersReceipts,
  billing,
  pwa,
};

const wanted = process.argv.slice(2);
browser = await chromium.launch();
try {
  for (const [name, run] of Object.entries(TOPICS)) {
    if (wanted.length && !wanted.includes(name)) continue;
    console.log(name);
    try {
      await run();
    } catch (e) {
      // Leave the screen that failed behind for whoever re-runs this.
      const failed = resolve(tmpdir(), 'warung-panduan-failed.png');
      for (const p of pages) if (!p.isClosed()) await p.screenshot({ path: failed }).catch(() => {});
      console.error(`Last screen: ${failed}`);
      throw e;
    }
  }
} finally {
  await browser.close();
}
