import * as vscode from 'vscode';
import { CommandDocs } from '../utils/commands';

export class HamstoryHoverProvider implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken)
        : vscode.ProviderResult<vscode.Hover> {

        let range = document.getWordRangeAtPosition(position);
        if (!range?.isSingleLine) { return undefined; }

        let text = document.getText(range);
        let line = document.lineAt(range.start.line);
        let content = line.text.substring(line.firstNonWhitespaceCharacterIndex, line.text.length);

        if (content.startsWith('[')) {
            let endIdx = content.indexOf(']');
            if (endIdx !== -1 && content.substring(1, endIdx) === text) {
                return new vscode.Hover(this.createCommandHover(text.toLowerCase()));
            }
        }

        return undefined;
    }

    createCommandHover(command: string): vscode.MarkdownString[] {
        let results: vscode.MarkdownString[] = [];

        let cmdContent = new vscode.MarkdownString();
        cmdContent.appendCodeblock('[' + command[0].toUpperCase() + command.substring(1, command.length) + ']', "hamstory");
        results.push(cmdContent);

        if (CommandDocs.has(command)) {
            results.push(CommandDocs.get(command));
        }

        return results;
    }

}