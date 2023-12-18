import * as vscode from 'vscode';

export class HamstoryFormatter implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken)
        : vscode.ProviderResult<vscode.TextEdit[]> {

        const tabbing = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        const indentKeywords = ['-', '[If]','[Elif]', '[Else]'],
            outdentKeywords = ['-', '[/]', '[Elif]', '[Else]'];

        let depth = 0;
        let results: vscode.TextEdit[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            let content = line.text.substring(line.firstNonWhitespaceCharacterIndex, line.text.length);

            for (let j = 0; j < outdentKeywords.length; j++) {
                if (content.startsWith(outdentKeywords[j])) {
                    depth--;
                    depth = Math.max(0, depth);
                }
            }

            content = this.formatSentence(content);
            content = this.formatMenuItem(content);
            content = this.formatCommand(content);
            results.push(new vscode.TextEdit(line.range, tabbing.repeat(depth) + content));

            for (let j = 0; j < indentKeywords.length; j++) {
                if (content.startsWith(indentKeywords[j])) {
                    depth++;
                }
            }
        }

        return results;
    }

    formatSentence(line: string): string {
        let content = line;

        if (!content.startsWith('[') && !content.startsWith('-')) {
            let idx = content.indexOf(':');
            if (idx !== -1) {
                let leftIdx = idx - 1;
                while (content.at(leftIdx) === ' ' && leftIdx > 0) { leftIdx--; }

                let rightIdx = idx + 1;
                while (content.at(rightIdx) === ' ' && rightIdx < content.length) { rightIdx++; }

                content = content.substring(0, leftIdx + 1) + ': ' + content.substring(rightIdx, content.length);
            }
        }
        return content;
    }

    formatMenuItem(line: string): string {
        let content = line;

        if (content.startsWith('-')) {
            let idx = 1;
            while (content.at(idx) === ' ' && idx < content.length) { idx++; }
            content = '- ' + content.substring(idx, content.length);
        }

        return content;
    }

    formatCommand(line: string): string {
        let content = line;

        let idx = content.indexOf(']');
        if (content.startsWith('[') && idx !== -1) {
            let cmdIdx = idx + 1;
            while (content.at(cmdIdx) === ' ' && cmdIdx < content.length) { cmdIdx++; }
            content = content.substring(0, idx + 1) + ' ' + content.substring(cmdIdx, content.length);
        }

        return content;
    }
}