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
    ["Activity Bar", "Sidebar", "Editor", "Badge"],
    {
      placeHolder: "Select UI parts to apply the theme to",
      canPickMany: true,
    }
  );
  return uiParts || [];
}

function applyTheme(college: College, uiParts: string[]) {
  const lessIntenseSecondaryColor = adjustColorIntensity(college.secondary, 50); // 50% less intense

  const colors: { [key: string]: string } = {};
  if (uiParts.includes("Activity Bar")) {
    colors["activityBar.background"] = college.primary;
    colors["activityBar.foreground"] = college.secondary;
  }
  if (uiParts.includes("Sidebar")) {
    colors["sideBar.background"] = college.primary;
    colors["sideBar.foreground"] = college.secondary;
  }
  if (uiParts.includes("Editor")) {
    colors["editor.background"] = college.primary;
    colors["editor.foreground"] = college.secondary;
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
