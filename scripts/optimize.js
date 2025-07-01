import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import CleanCSS from 'clean-css';

const cleanCSS = new CleanCSS();

// Optimize JavaScript files
async function optimizeJS() {
    const jsFiles = ['js/newApp.js', 'js/newRouter.js'];
    
    for (const file of jsFiles) {
        if (fs.existsSync(file)) {
            const code = fs.readFileSync(file, 'utf8');
            const result = await minify(code, {
                compress: true,
                mangle: true
            });
            
            if (result.code) {
                const optimizedFile = file.replace('.js', '.min.js');
                fs.writeFileSync(optimizedFile, result.code);
                console.log(`✅ 优化完成: ${optimizedFile}`);
            }
        }
    }
}

// Optimize CSS files
function optimizeCSS() {
    const cssFiles = ['styles/main.css'];
    
    for (const file of cssFiles) {
        if (fs.existsSync(file)) {
            const css = fs.readFileSync(file, 'utf8');
            const result = cleanCSS.minify(css);
            
            if (!result.errors.length) {
                const optimizedFile = file.replace('.css', '.min.css');
                fs.writeFileSync(optimizedFile, result.styles);
                console.log(`✅ 优化完成: ${optimizedFile}`);
            }
        }
    }
}

console.log('🔧 开始优化资源...');
await optimizeJS();
optimizeCSS();
console.log('✨ 优化完成！');