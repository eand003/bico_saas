const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let JavaScriptObfuscator;
try {
  JavaScriptObfuscator = require('javascript-obfuscator');
} catch (e) {
  console.log('📦 Instalando javascript-obfuscator para a compilação local...');
  execSync('npm install javascript-obfuscator --no-audit --no-fund', { stdio: 'inherit' });
  JavaScriptObfuscator = require('javascript-obfuscator');
}

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

// Configurações de arquivos que NÃO devem ser copiados para a pasta dist
const excludeList = [
  '.git',
  'node_modules',
  'dist',
  'build_obfuscate.js',
  'package.json',
  'package-lock.json',
  '.gitignore'
];

console.log('🚀 Iniciando processo de compilação e proteção do Spray Precision...');

// 1. Limpar diretório dist anterior
if (fs.existsSync(distDir)) {
  console.log('🧹 Removendo diretório /dist anterior...');
  fs.rmSync(distDir, { recursive: true, force: true });
}

// 2. Criar novo diretório dist
fs.mkdirSync(distDir);

// Função para cópia recursiva com filtros
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  const baseName = path.basename(src);
  if (excludeList.includes(baseName)) {
    return;
  }

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Copiando arquivos do projeto para /dist...');
copyRecursiveSync(rootDir, distDir);

// Opções de ofuscação balanceadas (segurança máxima, sem quebrar performance)
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: false, // Desativado para manter performance alta no campo, mas com proteção forte
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.85,
  transformObjectKeys: true,
  unicodeEscapeSequence: true
};

// 3. Função para ofuscar arquivos JS programaticamente
function obfuscateJsFile(filePath) {
  console.log(`🔒 Protegendo arquivo JS: ${path.relative(distDir, filePath)}...`);
  try {
    const originalCode = fs.readFileSync(filePath, 'utf8');
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalCode, obfuscationOptions);
    fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
  } catch (err) {
    console.error(`❌ Erro ao ofuscar JS ${filePath}:`, err.message);
    process.exit(1);
  }
}

// 4. Função para ofuscar scripts inline em arquivos HTML
function obfuscateHtmlFile(filePath) {
  console.log(`🔒 Protegendo scripts em HTML: ${path.relative(distDir, filePath)}...`);
  try {
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Expressão regular para encontrar tags <script> com código JavaScript inline
    const obfuscatedHtml = htmlContent.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
      // Pular se for script externo (tem src)
      if (/\bsrc\s*=/i.test(match)) {
        return match;
      }
      
      // Pular se o script estiver vazio
      if (!scriptContent.trim()) {
        return match;
      }
      
      try {
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(scriptContent, obfuscationOptions).getObfuscatedCode();
        
        // Obter a tag de abertura original (<script ...>)
        const openTagMatch = match.match(/<script\b[^>]*>/i);
        const openTag = openTagMatch ? openTagMatch[0] : '<script>';
        
        return `${openTag}\n${obfuscatedCode}\n</script>`;
      } catch (errObfuscate) {
        console.warn(`⚠️ Aviso: Falha ao ofuscar script inline em ${filePath}. Mantendo original.`, errObfuscate.message);
        return match;
      }
    });
    
    fs.writeFileSync(filePath, obfuscatedHtml, 'utf8');
  } catch (err) {
    console.error(`❌ Erro ao ofuscar HTML ${filePath}:`, err.message);
    process.exit(1);
  }
}

// 5. Buscar e ofuscar arquivos HTML e JS recursivamente na pasta /dist
function processDistFolder(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDistFolder(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.js') {
        obfuscateJsFile(fullPath);
      } else if (ext === '.html') {
        obfuscateHtmlFile(fullPath);
      }
    }
  });
}

console.log('🛡️ Ofuscando arquivos na pasta de distribuição (/dist)...');
processDistFolder(distDir);

console.log('\n✨ CONCLUÍDO! O Spray Precision foi compilado com sucesso e está 100% protegido na pasta /dist/ ✨');
console.log('Você pode enviar os arquivos da pasta /dist diretamente para o servidor de produção/hospedagem.');
