// 引入必要的模块
const fs = require('fs-extra'); // 提供更强大的文件操作功能
const path = require('path');
const beautify = require('js-beautify').html;
const md = require('./markdown.js');
const htmlTemplatePromise = import('./html_template.mjs');

/**
 * 确保指定文件夹存在，如果不存在则异步创建
 * 使用场景：在进行文件操作前，需要确认文件夹路径是否存在，避免因路径不存在导致的文件操作失败
 * @param {string} folderPath - 需要确保存在的文件夹路径
 */
async function ensureFolderExists(folderPath) {
    try {
        await fs.ensureDir(folderPath); // 自动检查并创建文件夹
        console.log(`文件夹已存在或已创建: ${folderPath}`);
    } catch (error) {
        console.error(`处理文件夹时出错:`, error.message);
    }
}

/**
 * 编译单个 Markdown 文件为 HTML 文件
 * @param {string} mdFilePath - Markdown 文件路径
 * @param {string} htmlFilePath - 生成的 HTML 文件路径
 */
async function compileMarkdownFile(mdFilePath, htmlFilePath, htmlTemplate) {
    try {

        // 读取 Markdown 文件内容
        const mdContent = await fs.readFile(mdFilePath, 'utf-8');

        // 使用 markdown-it 将 Markdown 转换为 HTML
        const htmlContent = htmlTemplate(md.render(mdContent));
        // 使用 js-beautify 格式化 HTML
        const formattedHtml = beautify(htmlContent, {
            indent_size: 2, // 缩进大小
            indent_char: ' ', // 缩进字符（空格）
            wrap_line_length: 80, // 每行最大长度
            end_with_newline: true, // 文件末尾添加换行符
        });
        // 确保目标目录存在
        await fs.ensureDir(path.dirname(htmlFilePath));
        // 写入 HTML 文件
        await fs.writeFile(htmlFilePath, formattedHtml, 'utf-8');
        console.log(`成功生成: ${htmlFilePath}`);
    } catch (error) {
        console.error(`处理文件 ${mdFilePath} 时出错:`, error.message);
    }
}

/**
 * 遍历目录并将所有 .md 文件编译为 .html 文件
 * @param {string} sourceDir - 源目录
 * @param {string} targetDir - 目标目录
 */
async function compileMarkdownDirectory(sourceDir, targetDir) {
    try {
        // 确保目标目录存在
        await ensureFolderExists(targetDir);
        // 校验源目录是否存在
        if (!(await fs.pathExists(sourceDir))) {
            console.error(`源目录不存在: ${sourceDir}`);
            return;
        }
        // 获取源目录中的所有文件
        const files = await fs.readdir(sourceDir);

        // 遍历文件列表
        for (const file of files) {
            const filePath = path.join(sourceDir, file);
            const stats = await fs.stat(filePath); // 获取文件状态

            if (stats.isDirectory()) {
                // 如果是子目录，递归处理
                const subSourceDir = filePath;
                const subTargetDir = path.join(targetDir, file);
                await compileMarkdownDirectory(subSourceDir, subTargetDir);
            } else if (stats.isFile() && path.extname(file).toLowerCase() === '.md') {
                // 如果是 .md 文件，进行编译
                const htmlFilePath = path.join(targetDir, `${path.basename(file, '.md')}.html`);
                const { default: htmlTemplate } = await htmlTemplatePromise;
                await compileMarkdownFile(filePath, htmlFilePath, htmlTemplate);
            }
        }
    } catch (error) {
        console.error(`处理目录 ${sourceDir} 时出错:`, error.message);
    }
}


module.exports = {
    compileMarkdownDirectory,
    path
};
