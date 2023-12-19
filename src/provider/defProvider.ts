import * as vscode from 'vscode';
import { DocumentUtils } from '../utils/documentUtils';

export class HamstoryDefProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken)
        : vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {

        let range = document.getWordRangeAtPosition(position);
        if (!range?.isSingleLine) { return undefined; }

        let text = document.getText(range);
        let line = document.lineAt(range.start.line);
        let content = line.text.substring(line.firstNonWhitespaceCharacterIndex, line.text.length);

        if (content.startsWith(text) && content.length > text.length) {
            let idx = text.length;
            while (idx < content.length) {
                if (content.charAt(idx) === ':') {

                    let chars = DocumentUtils.getCharacterList(document);
                    for (let i = 0; i < chars.length; i++) {
                        if (chars[i].name === text) {
                            return new vscode.Location(document.uri, chars[i].range);
                        }
                    }
                    return undefined;
                }
                else if (content.charAt(idx) !== ' ') {
                    break;
                }
                idx++;
            }
        }
        return undefined;
    }
}