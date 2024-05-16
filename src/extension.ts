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

  let adjustIntensity = vscode.commands.registerCommand(
    "extension.adjustIntensity",
    async () => {
      const intensity = await vscode.window.showInputBox({
        placeHolder: "Enter color intensity (0 to 100)",
        validateInput: (value) => {
          const num = Number(value);
          return isNaN(num) || num < 0 || num > 100
            ? "Intensity must be a number between 0 and 100"
            : null;
        },
      });

      if (intensity !== undefined) {
        const currentCollege =
          context.globalState.get<College>("currentCollege");
        if (currentCollege) {
          applyTheme(currentCollege, Number(intensity));
        }
      }
    }
  );

  context.subscriptions.push(selectCollege);
  context.subscriptions.push(adjustIntensity);
}

function applyTheme(college: College, intensity: number = 100) {
  const adjustedPrimaryColor = adjustColorIntensity(
    college.primaryColor,
    intensity
  );
  const adjustedSecondaryColor = adjustColorIntensity(
    college.secondaryColor,
    intensity
  );

  const theme = {
    base: "vs-dark",
    inherit: true,
    rules: [
      { background: adjustedPrimaryColor },
      { token: "comment", foreground: adjustedSecondaryColor },
    ],
    colors: {
      "editor.background": adjustedPrimaryColor,
      "editor.foreground": adjustedSecondaryColor,
    },
  };

  vscode.workspace
    .getConfiguration()
    .update("workbench.colorCustomizations", theme.colors, true);
  vscode.workspace
    .getConfiguration()
    .update(
      "editor.tokenColorCustomizations",
      { textMateRules: theme.rules },
      true
    );

  vscode.window.showInformationMessage(
    `Applied ${college.name} theme with ${intensity}% intensity`
  );
}

function adjustColorIntensity(color: string, intensity: number): string {
  const f = parseInt(color.slice(1), 16);
  const t = intensity / 100;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;

  return `#${(
    0x1000000 +
    (Math.round((255 - R) * t) + R) * 0x10000 +
    (Math.round((255 - G) * t) + G) * 0x100 +
    (Math.round((255 - B) * t) + B)
  )
    .toString(16)
    .slice(1)}`;
}

export function deactivate() {}
