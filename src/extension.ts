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
          const uiParts = await selectUIParts();
          if (uiParts.length > 0) {
            applyTheme(selectedCollege, uiParts);
          }
        }
      }
    }
  );

  context.subscriptions.push(selectCollege);
}

async function selectUIParts(): Promise<string[]> {
  const uiParts = await vscode.window.showQuickPick(
    ["Activity Bar", "Sidebar", "Buttons", "Terminal"],
    {
      placeHolder: "Select UI parts to apply the theme to",
      canPickMany: true,
    }
  );
  return uiParts || [];
}

function applyTheme(college: College, uiParts: string[]) {
  const colors: { [key: string]: string } = {};
  if (uiParts.includes("Activity Bar")) {
    colors["activityBar.background"] = college.primary;
    colors["activityBar.foreground"] = college.secondary;
    colors["activityBar.activeBorder"] = college.secondary;
  }
  if (uiParts.includes("Sidebar")) {
    colors["sideBar.background"] = college.primary;
    colors["sideBar.foreground"] = college.secondary;
  }
  if (uiParts.includes("Buttons")) {
    colors["button.background"] = college.primary;
    colors["button.foreground"] = college.secondary;
  }
  if (uiParts.includes("Terminal")) {
    colors["terminal.background"] = college.primary;
    colors["terminal.foreground"] = college.secondary;
  }

  const theme = {
    base: "vs-dark",
    inherit: true,
    colors: colors,
  };

  vscode.workspace
    .getConfiguration()
    .update("workbench.colorCustomizations", theme.colors, true);
  vscode.workspace
    .getConfiguration()
    .update("editor.tokenColorCustomizations", {}, true);

  vscode.window.showInformationMessage(
    `Applied ${college.name} theme to selected parts`
  );
}

export function deactivate() {}
