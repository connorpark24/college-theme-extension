import * as vscode from "vscode";

export async function selectUIParts(): Promise<string[]> {
  const uiParts = await vscode.window.showQuickPick(
    ["Activity Bar", "Sidebar", "Buttons", "Terminal", "Status Bar"],
    {
      placeHolder: "Select UI parts to apply the theme to",
      canPickMany: true,
    }
  );
  return uiParts || [];
}

export async function getIntensity(): Promise<number> {
  const intensity = await vscode.window.showInputBox({
    placeHolder: "Enter an intensity value between 0 and 100",
    validateInput: (value) => {
      const num = Number(value);
      return num >= 0 && num <= 100
        ? null
        : "Please enter a valid intensity between 0 and 100";
    },
  });

  return intensity ? Number(intensity) : 50;
}

export function adjustColor(hex: string, intensity: number): string {
  if (intensity < 50) {
    return lightenColor(hex, intensity);
  } else if (intensity > 50) {
    return darkenColor(hex, intensity);
  }
  return hex;
}

function lightenColor(hex: string, intensity: number): string {
  const factor = ((50 - intensity) / 50) * 0.25;
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.min(255, Math.round(r + (255 - r) * factor));
  g = Math.min(255, Math.round(g + (255 - g) * factor));
  b = Math.min(255, Math.round(b + (255 - b) * factor));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

function darkenColor(hex: string, intensity: number): string {
  const factor = ((intensity - 50) / 50) * 0.25;
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.max(0, Math.round(r - r * factor));
  g = Math.max(0, Math.round(g - g * factor));
  b = Math.max(0, Math.round(b - b * factor));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}
