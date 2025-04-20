// 引入必要的模块
const fs = require('fs-extra'); // 提供更强大的文件操作功能
const path = require('path');
// 所有的选项列表（默认情况下）
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js'); // 引入 highlight.js
const beautify = require('js-beautify').html;
const { parseDocument,DomUtils } = require('htmlparser2');
const { serialize } = require('dom-serializer'); // 用于序列化 DOM 树
// 初始化 markdown-it 实例
const md = new MarkdownIt({
    html: true,        // 在源码中启用 HTML 标签
    xhtmlOut: true,        // 使用 '/' 来闭合单标签 （比如 <br />）。
    // 这个选项只对完全的 CommonMark 模式兼容。
    breaks: true,        // 转换段落里的 '\n' 到 <br>。
    langPrefix: 'language-',  // 给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用。
    linkify: true,        // 将类似 URL 的文本自动转换为链接。
    // 启用一些语言中立的替换 + 引号美化
    typographer: false,
    // 双 + 单引号替换对，当 typographer 启用时。
    // 或者智能引号等，可以是 String 或 Array。
    //
    // 比方说，你可以支持 '«»„“' 给俄罗斯人使用， '„“‚‘'  给德国人使用。
    // 还有 ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] 给法国人使用（包括 nbsp）。
    quotes: '“”‘’',
    // 高亮函数，会返回转义的HTML。
    // 或 '' 如果源字符串未更改，则应在外部进行转义。
    // 如果结果以 <pre ... 开头，内部包装器则会跳过。
    highlight:  (code, language) => {
        // 使用 highlight.js 进行代码高亮
        if (language && hljs.getLanguage(language)) {
          try {
            return hljs.highlight(code, { language }).value;
          } catch (error) {
            console.error(`代码高亮出错:`, error.message);
          }
        }
        // 如果没有指定语言或语言不支持，则返回默认代码块
        return hljs.highlightAuto(code).value;
      }
});

md.use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-abbr"))
    .use(require("markdown-it-container"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-task-lists"))
    .use(require("markdown-it-ins"))
    .use(require("markdown-it-footnote"))

    ;

// 自定义渲染规则：将 .md 链接修改为 .html
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');

    if (hrefIndex >= 0) {
        let href = token.attrs[hrefIndex][1]; // 获取链接地址
        if (href.endsWith('.md')) {
            // 将 .md 替换为 .html
            href = href.replace(/\.md$/, '.html');
            token.attrs[hrefIndex][1] = href;
        }
    }

    return self.renderToken(tokens, idx, options);
};

// 自定义 img 标签的渲染规则
md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    
    // 获取图片的 src 和 alt 属性
    const src = token.attrGet('src');
  
    // 添加自定义属性
    token.attrSet('data-fancybox', src); // 添加自定义属性
  
    // 返回最终的 HTML
    return `<img ${self.renderAttrs(token)}>`;
  };

// 自定义渲染规则：拦截 <img> 标签
md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
  
    // 检查是否是 <img> 标签
    if (/<img\b[^>]*>/i.test(content)) {
        const dom = parseDocument(content);
        const imgNode = dom.children[0];
        // 修改 <img> 标签，例如添加自定义属性
        const attrs = imgNode.attribs;
        attrs['data-fancybox'] = attrs.src;
        return DomUtils.getOuterHTML(imgNode);
    }
  
    // 如果不是 <img> 标签，返回原始内容
    return content;
  };


// 定义源目录和目标目录
const sourceDir = path.join(__dirname, 'md'); // 存放 .md 文件的目录
const targetDir = path.join(__dirname, 'html'); // 输出 .html 文件的目录



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
async function compileMarkdownFile(mdFilePath, htmlFilePath) {
    try {
        const { default: htmlTemplate } = await import('./html_template.mjs');
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
                await compileMarkdownFile(filePath, htmlFilePath);
            }
        }
    } catch (error) {
        console.error(`处理目录 ${sourceDir} 时出错:`, error.message);
    }
}

//http://markdown-it.docschina.org/ 文档
// 主函数
(async () => {
    try {
        // 确保目标目录存在
        await ensureFolderExists(targetDir);

        // 开始编译
        await compileMarkdownDirectory(sourceDir, targetDir);
        console.log('所有文件编译完成！');
    } catch (error) {
        console.error('主程序运行时出错:', error.message);
    }
})();