import * as vscode from 'vscode';
import { DocumentUtils, HCharacter } from '../utils/documentUtils';
import { CommandDocs as Commands } from '../utils/commands';

export class HamstoryCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext)
        : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        let range = document.getWordRangeAtPosition(position);
        if (!range?.isSingleLine) { return undefined; }

        let text = document.getText(range);
        let line = document.lineAt(range.start.line);
        let content = line.text.substring(line.firstNonWhitespaceCharacterIndex, line.text.length);

        let results: vscode.CompletionItem[] = [];
        let chars = DocumentUtils.getCharacterList(document);
        this.provideChars(text, content, chars).forEach(i => {
            results.push(i);
        });
        this.provideCommands(text, content).forEach(i => {
            results.push(i);
        });

        return results;
    }

    provideChars(text: string, content: string, chars: HCharacter[]): vscode.CompletionItem[] {
        let results: vscode.CompletionItem[] = [];

        // 是否是语句开头
        if (content.startsWith(text)) {
            text = text.toLowerCase();

            // 寻找对应的角色
            for (let i = 0; i < chars.length; i++) {
                if (chars[i].name.toLowerCase().startsWith(text)) {
                    let comp = new vscode.CompletionItem(chars[i].name,
                        vscode.CompletionItemKind.Property);

                    comp.insertText = chars[i].name + ": ";
                    comp.detail = `${chars[i].name}: `;
                    comp.documentation = new vscode.MarkdownString(`#### 对话: 由 ${chars[i].name} 说话`);
                    results.push(comp);
                }
            }
        }
        return results;
    }

    provideCommands(text: string, content: string): vscode.CompletionItem[] {
        let results: vscode.CompletionItem[] = [];

        // 是否是语句开头
        if (content.startsWith(text)) {
            text = text.toLowerCase();

            let cmds = Commands.keys();
            for (let i = 0; i < cmds.length; i++) {
                if (cmds[i].startsWith(text)) {
                    let cmd = cmds[i].charAt(0).toUpperCase() + cmds[i].substring(1, cmds[i].length);
                    let comp = new vscode.CompletionItem(cmd,
                        vscode.CompletionItemKind.Method);

                    comp.insertText = Commands.isBlock(cmds[i]) ? `[${cmd}]\n\n[/]` : `[${cmd}]`;
                    comp.detail = `[${cmd}]`;
                    comp.documentation = Commands.get(cmds[i]);
                    comp.command = {
                        title: "format",
                        command: "editor.action.formatDocument",
                    };
                    results.push(comp);
                }
            }
        }

        return results;
    }
} 