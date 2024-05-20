import * as vscode from "vscode";
import { colleges, College } from "./colleges";

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

async function applyCollegeTheme() {
  const collegeNames = colleges.map((college) => college.name);
  const selectedCollegeName = await vscode.window.showQuickPick(collegeNames, {
    placeHolder: "Select your college",
  });

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

async function selectUIParts(): Promise<string[]> {
  const uiParts = await vscode.window.showQuickPick(
    ["Activity Bar", "Sidebar", "Buttons", "Terminal", "Status Bar"],
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
    // colors["activityBar.border"] = college.secondary;
    colors["activityBarBadge.foreground"] = college.primary;
    colors["activityBarBadge.background"] = college.secondary;
  }
  if (uiParts.includes("Sidebar")) {
    colors["sideBar.background"] = college.primary;
    colors["sideBar.foreground"] = college.secondary;
  }
  if (uiParts.includes("Buttons")) {
    colors["button.background"] = college.secondary;
    colors["button.foreground"] = college.primary;
    // colors["button.hoverBackground"] = college.secondary;
    colors["button.secondaryBackground"] = college.primary;
    colors["button.secondaryForeground"] = college.secondary;
    // colors["button.secondaryHoverBackground"] = college.secondary;
  }
  if (uiParts.includes("Terminal")) {
    colors["panel.background"] = college.primary;
    colors["panelTitle.activeBorder"] = college.secondary;
    colors["panelTitle.activeForeground"] = college.secondary;
    colors["terminal.foreground"] = college.secondary;
  }
  if (uiParts.includes("Status Bar")) {
    colors["statusBar.background"] = college.primary;
    colors["statusBar.foreground"] = college.secondary;
    colors["statusBarItem.remoteBackground"] = college.secondary;
    colors["statusBarItem.remoteForeground"] = college.primary;
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

async function resetThemeConfigurations() {
  await vscode.workspace
    .getConfiguration()
    .update("workbench.colorCustomizations", {}, true);
  await vscode.workspace
    .getConfiguration()
    .update("editor.tokenColorCustomizations", {}, true);
}

async function swapColors() {
  const collegeNames = colleges.map((college) => college.name);
  const selectedCollegeName = await vscode.window.showQuickPick(collegeNames, {
    placeHolder: "Select your college",
  });

  if (selectedCollegeName) {
    const selectedCollege = colleges.find(
      (college) => college.name === selectedCollegeName
    );
    if (selectedCollege) {
      const swappedCollege = {
        ...selectedCollege,
        primary: selectedCollege.secondary,
        secondary: selectedCollege.primary,
      };
      const uiParts = await selectUIParts();
      if (uiParts.length > 0) {
        applyTheme(swappedCollege, uiParts);
      }
      vscode.window.showInformationMessage(
        `Swapped colors for ${selectedCollege.name} and applied theme`
      );
    }
  }
}

async function inputCustomColors() {
  const primaryColor = await vscode.window.showInputBox({
    placeHolder: "Enter primary color (hex code)",
    validateInput: (value) =>
      /^#[0-9A-Fa-f]{6}$/.test(value)
        ? null
        : "Please enter a valid hex color code",
  });

  const secondaryColor = await vscode.window.showInputBox({
    placeHolder: "Enter secondary color (hex code)",
    validateInput: (value) =>
      /^#[0-9A-Fa-f]{6}$/.test(value)
        ? null
        : "Please enter a valid hex color code",
  });

  if (primaryColor && secondaryColor) {
    const customCollege: College = {
      name: "Custom",
      primary: primaryColor,
      secondary: secondaryColor,
    };

    const uiParts = await selectUIParts();
    if (uiParts.length > 0) {
      applyTheme(customCollege, uiParts);
    }
    vscode.window.showInformationMessage(
      "Applied custom colors to selected parts"
    );
  }
}

function getHoverColor() {
  return "hello";
}

export function deactivate() {}
