// 所有的选项列表（默认情况下）
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js'); // 引入 highlight.js
const { parseDocument,DomUtils } = require('htmlparser2');

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
    highlight: (code, language) => {
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
    .use(require("markdown-it-footnote"));



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

module.exports = md;