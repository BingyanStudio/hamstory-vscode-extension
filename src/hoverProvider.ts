import * as vscode from 'vscode';

export class HamstoryHoverProvider implements vscode.HoverProvider {

    descs: Map<string, string>;

    constructor() {
        this.descs = new Map<string, string>();
        this.descs.set("char", "### 角色声明  \n声明在当前剧情脚本中使用到的角色。  **应当被放置在脚本的最前侧。**  \n使用 **英文逗号** 分隔不同的角色。  \n例如：  \n```Hamstory  \n[Char] A, B, C  \n```");
        this.descs.set("menu", "### 创建菜单  \n在上一句话之后生成一个菜单供玩家选择。  \n菜单的各个选项可以使用 '-' 创建。  \n例如：  \n```Hamstory  \n[Menu]  \n- 选项1  \n   A: 你选择了选项1！  \n  \n- 选项2  \n   B: 你选择了选项2！  \n[/]  \n```");
        this.descs.set("if", "### 条件分歧  \n进行一次条件判断，如果成功，则执行下方的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 1  \n   A: 你已经跟我说过话了！  \n[/]  \n```");
        this.descs.set("elif", "### 条件分歧  \n进行一次条件判断，如果成功，则执行下方的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 2  \n   A: 你已经跟我说过2次话了！  \n[Elif] { chatTime } == 1  \n    A: 你跟我说过一次话了！  \n[/]  \n```");
        this.descs.set("else", "### 条件分歧  \n用于 [If] 或 [Elif] 后方，在不符合前面的条件判断时执行此处的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 1  \n   A: 你已经跟我说过话了！  \n[Else]  \n    A: 你好！  \n[/]  \n```");
        this.descs.set("jump", "### 跨脚本跳转  \n从当前脚本跳出，跳转到其他脚本继续执行。  \n你需要在后方指定端口名称。如果不指定，则跳转到默认的下一个脚本。  \n`StoryGraph` 会依据此处给定的名称创建连接端口，以供配置下一个脚本具体是什么。  \n例如：  \n```Hamstory  \n[Jump] 分支2  \n```");
    }

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

        if (this.descs.has(command)) {
            results.push(new vscode.MarkdownString(this.descs.get(command)));
        }

        return results;
    }

}