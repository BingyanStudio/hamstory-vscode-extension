import * as vscode from 'vscode';

export class DocumentUtils {
    static getCharacterList(doc: vscode.TextDocument): HCharacter[] {
        let results: HCharacter[] = [];

        for (let i = 0; i < doc.lineCount; i++) {
            let line = doc.lineAt(i);
            let content = line.text.substring(
                line.firstNonWhitespaceCharacterIndex,
                line.text.length);

            if (content.toLowerCase().startsWith("[char]")) {
                let startIdx = 6;
                while (startIdx < content.length && content.charAt(startIdx) === ' ') {
                    startIdx++;
                }

                let endIdx = 0;
                while ((endIdx = content.indexOf(',', startIdx)) !== -1) {
                    let char = content.substring(startIdx, endIdx).trim();
                    results.push(new HCharacter(char, new vscode.Range(i, endIdx - char.length, i, endIdx)));
                    startIdx = endIdx + 1;
                }

                let char = content.substring(startIdx, content.length).trim();
                results.push(new HCharacter(char, new vscode.Range(i, content.length - char.length, i, content.length)));
            }
        }
        return results;
    }
}

export class HCharacter {
    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _range: vscode.Range;
    public get range(): vscode.Range {
        return this._range;
    }

    constructor(name: string, range: vscode.Range) {
        this._name = name;
        this._range = range;
    }
}