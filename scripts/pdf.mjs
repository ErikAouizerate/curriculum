import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { copyFile, readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

import { chromium } from "playwright";

const root = resolve(process.argv[2] ?? ".vercel/output/static");
const output = join(root, "Erik_Aouizerate_CV.pdf");
const port = Number(process.env.PDF_PORT ?? 4173);
const channel = process.env.PLAYWRIGHT_CHANNEL;

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

if (!existsSync(join(root, "index.html"))) {
  throw new Error(`No static build at ${root}. Run pnpm build first.`);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";

  for (const candidate of [pathname, `${pathname}.html`]) {
    const file = normalize(join(root, candidate));
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end("forbidden");
      return;
    }
    try {
      const body = await readFile(file);
      response.writeHead(200, {
        "content-type": MIME[extname(file)] ?? "application/octet-stream",
      });
      response.end(body);
      return;
    } catch {
      continue;
    }
  }

  response.writeHead(404).end("not found");
});

await new Promise((listening) => server.listen(port, "127.0.0.1", listening));

const browser = await chromium.launch(channel ? { channel } : {});
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
  server.close();
}

if (existsSync("static")) {
  await copyFile(output, join(resolve("static"), "Erik_Aouizerate_CV.pdf"));
}

console.log(`PDF written to ${output}`);
