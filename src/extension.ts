import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "codeResourceHelper" is now active!');

  let disposable = vscode.commands.registerCommand(
    "codeResourceHelper.showResources",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text) {
          const resources = getResourcesForCode(text);
          showResources(resources);
        } else {
          vscode.window.showInformationMessage(
            "Please select some code to find resources."
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function getResourcesForCode(code: string): string[] {
  // Placeholder: Implement your logic here to determine resources based on the code
  return [
    "https://example.com/resource1",
    "https://example.com/resource2",
    "https://example.com/resource3",
  ];
}

function showResources(resources: string[]): void {
  const message = resources.join("\n");
  vscode.window.showInformationMessage(`Resources for your code:\n${message}`);
}
