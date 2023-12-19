// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HamstoryFormatter } from './provider/formatter';
import { HamstoryHoverProvider } from './provider/hoverProvider';
import { HamstoryDefProvider } from './provider/defProvider';
import { HamstoryCompletionProvider } from './provider/completionProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// 格式化工具
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			"hamstory", new HamstoryFormatter()));

	// 提供悬停内容
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			"hamstory", new HamstoryHoverProvider()));

	// 提供角色引用追溯
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(
			"hamstory", new HamstoryDefProvider()
		)
	);

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			"hamstory", new HamstoryCompletionProvider()
		)
	);

	console.log("加载完成！");
}

// This method is called when your extension is deactivated
export function deactivate() { }
