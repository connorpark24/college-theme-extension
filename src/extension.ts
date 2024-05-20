import * as vscode from "vscode";
import { colleges, College } from "./colleges";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "college-theme" is now active!');

  let selectCollege = vscode.commands.registerCommand(
    "extension.selectCollege",
    async () => {
      const collegeNames = colleges.map((college) => college.name);
      const selectedCollegeName = await vscode.window.showQuickPick(
        collegeNames,
        {
          placeHolder: "Select your college",
        }
      );

      if (selectedCollegeName) {
        const selectedCollege = colleges.find(
          (college) => college.name === selectedCollegeName
        );
        if (selectedCollege) {
          applyTheme(selectedCollege);
        }
      }
    }
  );

  context.subscriptions.push(selectCollege);
}

function applyTheme(college: College) {
  const theme = {
    base: "vs-dark",
    inherit: true,
    colors: {
      "activityBar.background": college.primary,
      "activityBar.foreground": college.secondary,
    },
  };

  vscode.workspace
    .getConfiguration()
    .update("workbench.colorCustomizations", theme.colors, true);
  vscode.workspace
    .getConfiguration()
    .update("editor.tokenColorCustomizations", {}, true);

  vscode.window.showInformationMessage(`Applied ${college.name} theme`);
}

export function deactivate() {}
