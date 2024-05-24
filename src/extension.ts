import * as vscode from "vscode";
import {
  applyCollegeTheme,
  resetThemeConfigurations,
  swapColors,
  inputCustomColors,
} from "./theme";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "college-theme" is now active!');

  let configureTheme = vscode.commands.registerCommand(
    "extension.configureTheme",
    async () => {
      const options = await vscode.window.showQuickPick(
        [
          "Apply College Theme",
          "Reset Theme",
          "Swap Primary and Secondary Colors",
          "Input Custom Colors",
        ],
        {
          placeHolder: "Select an action",
        }
      );

      switch (options) {
        case "Apply College Theme":
          await applyCollegeTheme();
          break;
        case "Reset Theme":
          await resetThemeConfigurations();
          vscode.window.showInformationMessage(
            "Theme has been reset to default settings"
          );
          break;
        case "Swap Primary and Secondary Colors":
          await swapColors();
          break;
        case "Input Custom Colors":
          await inputCustomColors();
          break;
      }
    }
  );

  context.subscriptions.push(configureTheme);
}

export function deactivate() {}
