import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const REPORT_DIR = path.resolve(process.cwd(), 'reports/lighthouse')
fs.mkdirSync(REPORT_DIR, { recursive: true })

console.log('--- Kurio NFT Marketplace - Auditoria Lighthouse ---')
console.log('Metas Obrigatórias:')
console.log('• Performance: >= 90')
console.log('• Accessibility: >= 95')
console.log('• Best Practices: >= 95')
console.log('• SEO: >= 90')
console.log('\nPara executar uma auditoria completa contra o servidor de preview:')
console.log('1. npm run build')
console.log('2. npm run preview -- --port 4173')
console.log('3. npx lighthouse http://localhost:4173 --output html --output-path ./reports/lighthouse/home-desktop.html --preset=desktop --chrome-flags="--headless"')
console.log('4. npx lighthouse http://localhost:4173/nft/nft-1 --output html --output-path ./reports/lighthouse/detail-desktop.html --preset=desktop --chrome-flags="--headless"')
