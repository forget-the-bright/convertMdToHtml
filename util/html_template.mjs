function htmlTemplate(htmlContent) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Markdown to HTML</title>
      <link rel="stylesheet" href="https://github.githubassets.com/assets/frameworks-0e6d32d2.css">
      <link rel="stylesheet" href="https://github.githubassets.com/assets/site-3a3a0e1d.css">
      <style>
          body {
              overflow-x: hidden;
          }
          .container {
              margin: 0 auto;
              width: 1020px;
          }
          .nav-wrap {
              display: block;
              height: 650px;
              float: left;
              position: fixed;
              padding: 3px;
              margin: 0;
              border: 0;
              font: 13px Helvetica, arial, freesans, clean, sans-serif;
              line-height: 1.4;
              
          }
          .nav {
              display: block;
              float: left;
              position: fixed;
              padding: 3px;
              border-radius: 2px;
              margin: 40px 0 0 0;
              border: 0;
              font: 13px Helvetica, arial, freesans, clean, sans-serif;
              line-height: 1.4;
              background: #ffffff; overflow: hidden;
          }
          .nav ul {
              background: #fafafb;
              border-radius: 2px;
              border: 1px solid #d8d8d8;
              margin: 0;
              padding: 0;
              list-style: none;
              display: block;
          }
          .nav ul li {
              display: list-item;
              border-top: 1px solid #fff;
              border-bottom: 1px solid #eee;
          }
          .nav ul li a {
              display: block;
              padding: 8px 10px 8px 8px;
              text-shadow: 0 1px 0 #fff;
              border-left: 2px solid #fafafb;
              color: #4183c4;
              text-decoration: none;
          }
          .nav ul li a:-webkit-any-link {
              cursor: auto;
          }
        .markdown-body {
             box-sizing: border-box;
             min-width: 200px;
             max-width: 980px;
             margin: 0 auto;
             padding: 10px;
         }
         @media (max-width: 767px) {
            .markdown-body {
                 padding: 15px;
             }
         }
        .markdown-body img {
            max-width: 100%;
        }
      </style>
      <style>
        
             /* 添加自定义样式 */
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          pre {
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
          code {
            padding: 2px 4px;
            border-radius: 3px;
            font-family: "Source Code Pro", monospace;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
          }
      </style>
      <!-- 引入 highlight.js 样式  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"-->
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css">
    </head>
    <body>
    <div class="container">
          <div class="nav-wrap">
              <div class="nav"></div>
          </div>
          <div class="markdown-body">
               ${htmlContent}
           </div>
    </div>  
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js"></script>
    <script>
      hljs.highlightAll();

      // 定义全局配置
      Fancybox.defaults = {
        ...Fancybox.defaults, // 保留默认配置
        Thumbs: {
          autoStart: true, // 自动显示缩略图
        },
        Image: {
          maxWidth: 10000, // 允许图片放大超过原始宽度
          maxHeight: 10000, // 允许图片放大超过原始高度
          zoom: true, // 启用缩放功能
        },
      };
    </script>
    </html>
    `;
}
export default htmlTemplate;