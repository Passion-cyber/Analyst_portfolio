/**
 * Converts your own photos/screenshots into web-optimised AVIF + WebP + JPG.
 *
 *   1. Put originals (jpg/png/webp/tiff) in   public/images/raw/
 *   2. Run                                     npm run images
 *   3. Optimised files appear in               public/images/<name>.{avif,webp,jpg}
 *
 * Files are resized to at most MAX_WIDTH px wide. Name your portrait
 * `portrait.jpg` to replace the placeholder automatically, and reference
 * project screenshots from src/content/projects.ts → `thumbnail`.
 */
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, extname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const MAX_WIDTH = 1600
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = join(root, 'public', 'images', 'raw')
const outDir = join(root, 'public', 'images')

if (!existsSync(rawDir)) {
  mkdirSync(rawDir, { recursive: true })
  console.log('Created public/images/raw — add images there and run again.')
  process.exit(0)
}

const files = readdirSync(rawDir).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
if (files.length === 0) console.log('No images found in public/images/raw.')

for (const file of files) {
  const name = basename(file, extname(file))
  const input = sharp(join(rawDir, file)).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })
  const { width, height } = await input.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
  await Promise.all([
    input.clone().avif({ quality: 55 }).toFile(join(outDir, `${name}.avif`)),
    input.clone().webp({ quality: 78 }).toFile(join(outDir, `${name}.webp`)),
    input.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(join(outDir, `${name}.jpg`)),
  ])
  console.log(`  ✓ ${name}  (${width}×${height}) → avif, webp, jpg`)
}
