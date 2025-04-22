const { compileMarkdownDirectory ,path } = require("./util/compile-md-to-html");
// 定义源目录和目标目录
const sourceDir = path.join(__dirname, 'md'); // 存放 .md 文件的目录
const targetDir = path.join(__dirname, 'html'); // 输出 .html 文件的目录
//http://markdown-it.docschina.org/ 文档
// 主函数
(async () => {
    try {
        // 开始编译
        await compileMarkdownDirectory(sourceDir, targetDir);
        console.log('所有文件编译完成！');
    } catch (error) {
        console.error('主程序运行时出错:', error.message);
    }
})();