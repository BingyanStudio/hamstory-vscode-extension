import * as vscode from 'vscode';

export class CommandDocs {
    private static docs: { [key: string]: string } = {
        "char": "### 角色声明  \n声明在当前剧情脚本中使用到的角色。  **应当被放置在脚本的最前侧。**  \n使用 **英文逗号** 分隔不同的角色。  \n例如：  \n```Hamstory  \n[Char] A, B, C  \n```",
        "menu": "### 创建菜单  \n在上一句话之后生成一个菜单供玩家选择。  \n菜单的各个选项可以使用 '-' 创建。  \n例如：  \n```Hamstory  \n[Menu]  \n- 选项1  \n   A: 你选择了选项1！  \n  \n- 选项2  \n   B: 你选择了选项2！  \n[/]  \n```",
        "if": "### 条件分歧  \n进行一次条件判断，如果成功，则执行下方的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 1  \n   A: 你已经跟我说过话了！  \n[/]  \n```",
        "elif": "### 条件分歧  \n进行一次条件判断，如果成功，则执行下方的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 2  \n   A: 你已经跟我说过2次话了！  \n[Elif] { chatTime } == 1  \n    A: 你跟我说过一次话了！  \n[/]  \n````",
        "else": "### 条件分歧  \n用于 `[If]` 或 `[Elif]` 后方，在不符合前面的条件判断时执行此处的脚本。  \n使用 `{ 变量名 }` 来引用一个全局变量。  \n例如：  \n```Hamstory  \n[If] { chatTime } >= 1  \n   A: 你已经跟我说过话了！  \n[Else]  \n    A: 你好！  \n[/]  \n```",
        "jump": "### 跨脚本跳转  \n从当前脚本跳出，跳转到其他脚本继续执行。  \n你需要在后方指定端口名称。如果不指定，则跳转到默认的下一个脚本。  \n`StoryGraph` 会依据此处给定的名称创建连接端口，以供配置下一个脚本具体是什么。  \n例如：  \n```Hamstory  \n[Jump] 分支2  \n```"
    };

    private static blockCmds = ["menu", "if"];

    static has(key: string): boolean {
        return key in this.docs;
    }

    static get(key: string): vscode.MarkdownString {
        return new vscode.MarkdownString(this.docs[key]);
    }

    static keys(): string[] {
        return Object.keys(this.docs);
    }

    static isBlock(key: string): boolean {
        return this.blockCmds.indexOf(key) !== -1;
    }
}