// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const util = require('./util');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
    const resourcePath = util.getExtensionFileAbsolutePath(context, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

/**
 * 执行回调函数
 * @param {*} panel 
 * @param {*} message 
 * @param {*} resp 
 */
function invokeCallback(panel, message, resp) {
    console.log('Invoke call back: ', resp);
    // 错误码在400-600之间的，默认弹出错误提示
    if (typeof resp == 'object' && resp.code && resp.code >= 400 && resp.code < 600) {
        util.showError(resp.message || 'Unknown error occurred!');
    }
    panel.webview.postMessage({cmd: 'vscodeCallback', cbid: message.cbid, data: resp});
}

/**
 * 存放所有消息回调函数，根据 message.cmd 来决定调用哪个方法
 */
const messageHandler = {
    // 弹出提示
    alert(message) {
        util.showInfo(message.info);
    },
    // 显示错误提示
    error(message) {
        util.showError(message.info);
    },
    // 获取工程名
    getProjectName(global, message) {
        invokeCallback(global.panel, message, util.getProjectName(global.projectPath));
    },
    openFileInFinder(global, message) {
        util.openFileInFinder(`${global.projectPath}/${message.path}`);
        // 这里的回调其实是假的，并没有真正判断是否成功
        invokeCallback(global.panel, message, {code: 0, text: '成功'});
    },
    openFileInVscode(global, message) {
        util.openFileInVscode(`${global.projectPath}/${message.path}`, message.text);
        invokeCallback(global.panel, message, {code: 0, text: '成功'});
    },
    openUrlInBrowser(global, message) {
        util.openUrlInBrowser(message.url);
        invokeCallback(global.panel, message, {code: 0, text: '成功'});
    }
};


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "latex-snippets-jeff" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

    context.subscriptions.push(vscode.commands.registerCommand('latex-snippets.plot', function (uri) {
        // // 工程目录一定要提前获取，因为创建了webview之后activeTextEditor会不准确
        // const projectPath = util.getProjectPath(uri);
        // if (!projectPath) return;
        const panel = vscode.window.createWebviewPanel(
            'testWebview', // viewType
            "Plot", // 视图标题
            vscode.ViewColumn.Beside, // 显示在编辑器的哪个部位
            {
                enableScripts: true, // 启用JS，默认禁用
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            }
        );
        // let global = { projectPath, panel};
        panel.webview.html = getWebViewContent(context, 'src/plotDots.html');
        panel.webview.onDidReceiveMessage(message => {
            if (messageHandler[message.cmd]) {
                messageHandler[message.cmd](message);
            } else {
                util.showError(`Invoking method named ${message.cmd} not found!`);
            }
        }, undefined, context.subscriptions);
    }));

    // context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {

    // }))

}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
