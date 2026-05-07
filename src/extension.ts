import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('AIONS Language Support is now active!');

    const formatter = vscode.languages.registerDocumentFormattingEditProvider('aions', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const edits: vscode.TextEdit[] = [];
            let indentLevel = 0;
            const tabSize = 2; // 2 spaces per indentation level

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                let text = line.text.trim();

                if (text.length === 0) continue;

                // 1. Decrease indent BEFORE calculating if the line starts with a closing bracket
                if (text.startsWith('}') || text.startsWith(']')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }

                // 2. Fix Arrow Spacing
                if (text.includes('-->')) {
                    text = text.replace(/\s*-->\s*/g, ' --> ');
                }

                // 3. Construct the perfectly indented line
                const indentedLine = ' '.repeat(indentLevel * tabSize) + text;

                // 4. Increase indent AFTER calculating if the line ends with an opening bracket
                // (This ensures the NEXT line is indented)
                if (text.endsWith('{') || text.endsWith('[')) {
                    indentLevel++;
                }

                // 5. Apply the edit
                if (indentedLine !== line.text) {
                    edits.push(vscode.TextEdit.replace(line.range, indentedLine));
                }
            }

            return edits;
        }
    });

    context.subscriptions.push(formatter);
}

export function deactivate() {}