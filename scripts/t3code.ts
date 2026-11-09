import { color, type Theme } from "./theme.ts";

export interface T3CodeTheme {
  version: 1;
  id: string;
  name: string;
  appearance: "dark";
  colors: Record<string, string>;
  variants: { light: Record<string, string> };
}

// T3 Code roles, in the order of its THEME_COLOR_ROLES. The T3 Code import rejects a file with an unknown role.
const roles = (player: Theme["players"][number]): Record<string, string> => ({
  canvas: "editorBackground",
  chrome: "titleBarBackground",
  toolbar: "toolbarBackground",
  toolbarForeground: "text",
  toolbarBorder: "border",
  toolbarControl: "elementBackground",
  toolbarControlForeground: "text",
  toolbarControlHover: "elementHover",
  surface: "surfaceBackground",
  surfaceRaised: "elevatedSurfaceBackground",
  surfaceOverlay: "elevatedSurfaceBackground",
  text: "text",
  textMuted: "textMuted",
  border: "border",
  input: "border",
  focus: "borderFocused",
  accent: "textAccent",
  accentForeground: "editorBackground",
  secondary: "elementBackground",
  secondaryForeground: "text",
  muted: "elementBackground",
  mutedForeground: "textMuted",
  placeholder: "textPlaceholder",
  secondaryLabel: "textMuted",
  iconMuted: "iconMuted",
  error: "error",
  errorForeground: "error",
  errorSurface: "errorBackground",
  warning: "warning",
  warningForeground: "warning",
  warningSurface: "warningBackground",
  update: "info",
  updateForeground: "info",
  updateSurface: "infoBackground",
  accentSurface: "elementHover",
  accentSurfaceForeground: "text",
  messageSurface: "elementBackground",
  messageForeground: "text",
  messageAction: "textAccent",
  messageActionForeground: "editorBackground",
  messageActionHover: "linkTextHover",
  codeBackground: "panelBackground",
  codeForeground: "editorForeground",
  searchMatchBackground: "searchMatchBackground",
  searchMatchForeground: "text",
  // Madoe has one search-match color. The stronger highlight marks the active match.
  searchMatchActiveBackground: "editorDocumentHighlightWriteBackground",
  searchMatchActiveForeground: "text",
  sidebar: "panelBackground",
  sidebarForeground: "text",
  sidebarMutedForeground: "textMuted",
  sidebarControlSurface: "elementBackground",
  sidebarRowHover: "ghostElementHover",
  sidebarRowActive: "ghostElementActive",
  sidebarRowSelected: "ghostElementSelected",
  sidebarBorder: "border",
  terminalBackground: "terminalBackground",
  terminalForeground: "terminalForeground",
  terminalCursor: player.cursor,
  terminalSelection: player.selection,
  terminalScrollbar: "scrollbarThumbBackground",
  terminalScrollbarHover: "scrollbarThumbHoverBackground",
});

/** Map one neutral palette variant to the T3 Code color roles. */
export function t3codeColors(theme: Theme): Record<string, string> {
  return Object.fromEntries(
    Object.entries(roles(theme.players[0])).map(([role, token]) => [role, color(theme, token)]),
  );
}

/** Export the dark and the light variant as one T3 Code theme file. */
export function t3codeTheme(dark: Theme, light: Theme): T3CodeTheme {
  if (dark.appearance !== "dark") {
    throw new Error(`T3 Code needs a dark base variant, but ${dark.name} is "${dark.appearance}"`);
  }
  if (light.appearance !== "light") {
    throw new Error(`T3 Code needs a light variant, but ${light.name} is "${light.appearance}"`);
  }
  return {
    version: 1,
    id: "madoe",
    name: "Madoe",
    appearance: "dark",
    colors: t3codeColors(dark),
    variants: { light: t3codeColors(light) },
  };
}
