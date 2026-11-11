import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const nftsDir = path.resolve(process.cwd(), 'public/assets/nfts')
const files = fs.readdirSync(nftsDir)

for (const file of files) {
  if (file.endsWith('.png')) {
    const inputPath = path.join(nftsDir, file)
    const outputPath = path.join(nftsDir, file.replace('.png', '.webp'))
    await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath)
    console.log(`Converted: ${file} -> ${path.basename(outputPath)}`)
  }
}
console.log('Done converting images to WebP!')
