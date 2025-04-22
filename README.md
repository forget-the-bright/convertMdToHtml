### 项目描述

`convertMdToHtml` 是一个基于 JavaScript 的工具，用于将 Markdown 文件转换为 HTML 文件。该项目使用了 `markdown-it` 作为核心解析器，并集成了多种插件以支持丰富的 Markdown 功能（如代码高亮、脚注、任务列表等）。通过该工具，用户可以轻松地将 Markdown 文档转换为格式化良好的 HTML 页面，适用于文档生成、博客系统等场景。

---

### 技术栈

- **核心依赖**：
  - [`markdown-it`](https://github.com/markdown-it/markdown-it)：Markdown 解析器。
  - [`highlight.js`](https://highlightjs.org/)：代码高亮支持。
  - [`htmlparser2`](https://github.com/fb55/htmlparser2)：HTML 解析与处理。
  - [`js-beautify`](https://github.com/beautify-web/js-beautify)：美化生成的 HTML 输出。

- **扩展插件**：
  - `markdown-it-sub`、`markdown-it-sup`：上下标支持。
  - `markdown-it-mark`：高亮文本支持。
  - `markdown-it-abbr`：缩写支持。
  - `markdown-it-container`：自定义容器支持。
  - `markdown-it-deflist`：定义列表支持。
  - `markdown-it-task-lists`：任务列表支持。
  - `markdown-it-ins`：插入文本支持。
  - `markdown-it-footnote`：脚注支持。
  - `markdown-it-katex-external`：数学公式支持。

---

### 使用说明

#### 安装依赖
在项目根目录下运行以下命令安装所有依赖：
```bash
npm install
```

#### 运行工具
执行以下命令运行工具：
```bash
npm run compile
```

#### 测试工具
目前项目未配置测试用例，可以通过手动验证生成的 HTML 文件是否符合预期。

---

### 目录结构

```
convertMdToHtml/
├── markdown.mjs          # 核心逻辑：Markdown 转 HTML 的实现
├── compile-md-to-html.js # 主入口文件，负责调用转换逻辑
├── package.json          # 项目依赖和脚本配置
├── README.md             # 项目说明文档
└── node_modules/         # 依赖库目录
```

---

### 功能特性

1. **Markdown 基础功能**：
   - 支持标准 Markdown 语法（标题、段落、列表、链接、图片等）。
   - 自动将 `.md` 链接转换为 `.html` 链接。

2. **扩展功能**：
   - **代码高亮**：通过 `highlight.js` 实现代码块的语法高亮。
   - **自定义渲染规则**：
     - 图片标签添加 `data-fancybox` 属性，支持图片预览。
     - 自定义容器和脚注支持。
   - **任务列表**：支持 GitHub 风格的任务列表。

3. **HTML 输出优化**：
   - 使用 `js-beautify` 美化生成的 HTML，提升可读性。

---

### 示例

#### 输入 Markdown 文件
```markdown
# 标题

这是一个段落。

- 列表项 1
- 列表项 2

```javascript
console.log("Hello, world!");
```
```

#### 输出 HTML 文件
```html
<h1>标题</h1>
<p>这是一个段落。</p>
<ul>
  <li>列表项 1</li>
  <li>列表项 2</li>
</ul>
<pre><code class="language-javascript">console.log("Hello, world!");</code></pre>
```

---

### 开发规范

1. **代码风格**：
   - 使用 ESLint 或 Prettier 统一代码风格。
   - 遵循模块化设计原则，每个功能模块独立封装。

2. **依赖管理**：
   - 定期更新依赖版本，确保安全性。
   - 使用 `npm audit` 检查依赖漏洞。

3. **测试**：
   - 建议添加单元测试，覆盖核心功能。
   - 使用 Jest 或 Mocha 编写测试用例。

---

### 计划改进

1. **增加测试用例**：
   - 针对核心功能编写自动化测试，确保稳定性。

2. **支持更多 Markdown 扩展**：
   - 如表格、图表等复杂功能。

3. **优化性能**：
   - 提升大文件处理效率。

4. **CLI 工具**：
   - 提供命令行接口，支持批量转换。

---

### 贡献指南

欢迎提交 Issue 或 PR！请遵循以下步骤：
1. Fork 项目并克隆到本地。
2. 创建新分支进行开发。
3. 提交 PR 并详细描述改动内容。

---

### License

ISC License  
Copyright (c) 2023 wanghao