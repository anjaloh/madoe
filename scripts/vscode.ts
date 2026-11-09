import { color as resolve, highlight as resolveHighlight, type Style, type Theme } from './theme.ts';

interface VSCodeTheme {
  $schema: string;
  _comment: string;
  name: string;
  type: 'dark' | 'light';
  semanticHighlighting: boolean;
  colors: Record<string, string>;
  tokenColors: Array<{
    name: string;
    scope: string[];
    settings: { foreground: string; fontStyle: string };
  }>;
  semanticTokenColors: Record<string, Style>;
}

// Map UI roles explicitly. Equal colors do not make distinct roles interchangeable.
const uiColorSources: Record<string, string> = {
  "foreground": "text",
  "descriptionForeground": "textMuted",
  "disabledForeground": "textDisabled",
  "errorForeground": "error",
  "icon.foreground": "icon",
  "focusBorder": "borderFocused",
  "widget.shadow": "widgetShadow",
  "widget.border": "border",
  "textLink.foreground": "textAccent",
  "textLink.activeForeground": "linkTextHover",
  "textBlockQuote.background": "elevatedSurfaceBackground",
  "textSeparator.foreground": "border",
  "titleBar.activeBackground": "titleBarBackground",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "titleBarInactiveBackground",
  "titleBar.inactiveForeground": "textMuted",
  "titleBar.border": "border",
  "activityBar.background": "panelBackground",
  "activityBar.foreground": "icon",
  "activityBar.inactiveForeground": "iconMuted",
  "activityBar.border": "border",
  "activityBar.activeBorder": "textAccent",
  "activityBarBadge.background": "textAccent",
  "activityBarBadge.foreground": "editorBackground",
  "sideBar.background": "panelBackground",
  "sideBar.foreground": "text",
  "sideBar.border": "border",
  "sideBarTitle.foreground": "textMuted",
  "sideBarSectionHeader.background": "panelBackground",
  "sideBarSectionHeader.foreground": "text",
  "sideBarSectionHeader.border": "border",
  "statusBar.background": "statusBarBackground",
  "statusBar.foreground": "textMuted",
  "statusBar.border": "border",
  "statusBar.noFolderBackground": "statusBarBackground",
  "statusBar.debuggingBackground": "warning",
  "statusBar.debuggingForeground": "editorBackground",
  "statusBarItem.hoverBackground": "ghostElementHover",
  "statusBarItem.remoteBackground": "statusBarBackground",
  "statusBarItem.remoteForeground": "textAccent",
  "editorGroupHeader.tabsBackground": "tabBarBackground",
  "editorGroupHeader.tabsBorder": "border",
  "editorGroup.border": "paneGroupBorder",
  "editorGroup.dropBackground": "dropTargetBackground",
  "tab.activeBackground": "tabActiveBackground",
  "tab.activeForeground": "text",
  "tab.inactiveBackground": "tabInactiveBackground",
  "tab.inactiveForeground": "textMuted",
  "tab.border": "border",
  "tab.activeBorder": "tabActiveBackground",
  "tab.hoverBackground": "ghostElementHover",
  "tab.unfocusedActiveForeground": "textMuted",
  "breadcrumb.background": "toolbarBackground",
  "breadcrumb.foreground": "textMuted",
  "breadcrumb.focusForeground": "text",
  "breadcrumb.activeSelectionForeground": "text",
  "panel.background": "panelBackground",
  "panel.border": "border",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "textMuted",
  "panelTitle.activeBorder": "textAccent",
  "terminal.background": "terminalBackground",
  "terminal.foreground": "terminalForeground",
  "list.hoverBackground": "elementHover",
  "list.activeSelectionBackground": "elementSelected",
  "list.activeSelectionForeground": "text",
  "list.inactiveSelectionBackground": "elementActive",
  "list.focusOutline": "borderFocused",
  "list.highlightForeground": "textAccent",
  "list.errorForeground": "error",
  "list.warningForeground": "warning",
  "list.dropBackground": "dropTargetBackground",
  "tree.indentGuidesStroke": "panelIndentGuide",
  "tree.inactiveIndentGuidesStroke": "panelIndentGuide",
  "input.background": "elementBackground",
  "input.foreground": "text",
  "input.border": "border",
  "input.placeholderForeground": "textPlaceholder",
  "inputOption.activeBorder": "textAccent",
  "inputOption.activeBackground": "infoBackground",
  "dropdown.background": "elevatedSurfaceBackground",
  "dropdown.border": "border",
  "dropdown.foreground": "text",
  "button.background": "textAccent",
  "button.foreground": "editorBackground",
  "button.hoverBackground": "linkTextHover",
  "button.secondaryBackground": "elementBackground",
  "button.secondaryForeground": "text",
  "button.secondaryHoverBackground": "elementHover",
  "badge.background": "elementActive",
  "badge.foreground": "text",
  "checkbox.background": "elementBackground",
  "checkbox.border": "border",
  "editorWidget.background": "elevatedSurfaceBackground",
  "editorWidget.border": "border",
  "editorSuggestWidget.background": "elevatedSurfaceBackground",
  "editorSuggestWidget.border": "border",
  "editorSuggestWidget.selectedBackground": "elementSelected",
  "editorSuggestWidget.highlightForeground": "textAccent",
  "editorHoverWidget.background": "elevatedSurfaceBackground",
  "editorHoverWidget.border": "border",
  "quickInput.background": "elevatedSurfaceBackground",
  "quickInputList.focusBackground": "elementSelected",
  "menu.background": "elevatedSurfaceBackground",
  "menu.foreground": "text",
  "menu.selectionBackground": "elementSelected",
  "menu.border": "border",
  "notifications.background": "elevatedSurfaceBackground",
  "notifications.border": "border",
  "scrollbarSlider.background": "scrollbarThumbBackground",
  "scrollbarSlider.hoverBackground": "scrollbarThumbHoverBackground",
  "scrollbarSlider.activeBackground": "scrollbarThumbHoverBackground",
  "scrollbar.shadow": "borderTransparent",
  "progressBar.background": "textAccent",
  "minimap.background": "editorBackground",
  "editor.background": "editorBackground",
  "editor.foreground": "editorForeground",
  "editorGutter.background": "editorGutterBackground",
  "editorLineNumber.foreground": "editorLineNumber",
  "editorLineNumber.activeForeground": "editorActiveLineNumber",
  "editor.inactiveSelectionBackground": "editorHighlightedLineBackground",
  "editor.lineHighlightBackground": "editorActiveLineBackground",
  "editor.lineHighlightBorder": "borderTransparent",
  "editor.rangeHighlightBackground": "editorHighlightedLineBackground",
  "editor.findMatchBackground": "searchMatchBackground",
  "editor.findMatchHighlightBackground": "searchMatchBackground",
  "editor.findMatchBorder": "textAccent",
  "editor.wordHighlightBackground": "editorDocumentHighlightReadBackground",
  "editor.wordHighlightStrongBackground": "editorDocumentHighlightWriteBackground",
  "editorWhitespace.foreground": "editorInvisible",
  "editorIndentGuide.background1": "editorIndentGuide",
  "editorIndentGuide.activeBackground1": "editorIndentGuideActive",
  "editorRuler.foreground": "editorWrapGuide",
  "editorBracketMatch.background": "editorHighlightedLineBackground",
  "editorBracketMatch.border": "borderFocused",
  "editorGhostText.foreground": "predictive",
  "editorInlayHint.foreground": "hint",
  "editorInlayHint.background": "borderTransparent",
  "editorCodeLens.foreground": "hint",
  "editorLink.activeForeground": "linkTextHover",
  "editorError.foreground": "error",
  "editorWarning.foreground": "warning",
  "editorInfo.foreground": "info",
  "editorHint.foreground": "hint",
  "editorUnnecessaryCode.opacity": "unnecessaryCodeOpacity",
  "editorOverviewRuler.border": "border",
  "editorGutter.addedBackground": "versionControlAdded",
  "editorGutter.modifiedBackground": "versionControlModified",
  "editorGutter.deletedBackground": "versionControlDeleted",
  "diffEditor.insertedLineBackground": "createdBackground",
  "diffEditor.removedLineBackground": "deletedBackground",
  "merge.currentHeaderBackground": "createdBackground",
  "merge.incomingHeaderBackground": "infoBackground",
  "peekView.border": "borderFocused",
  "peekViewEditor.background": "editorSubheaderBackground",
  "peekViewResult.background": "panelBackground",
  "peekViewTitle.background": "panelBackground",
  "editorStickyScroll.background": "editorBackground",
  "editorStickyScrollHover.background": "editorActiveLineBackground",
  "gitDecoration.addedResourceForeground": "created",
  "gitDecoration.untrackedResourceForeground": "created",
  "gitDecoration.modifiedResourceForeground": "modified",
  "gitDecoration.deletedResourceForeground": "deleted",
  "gitDecoration.renamedResourceForeground": "renamed",
  "gitDecoration.ignoredResourceForeground": "ignored",
  "gitDecoration.conflictingResourceForeground": "conflict",
  "problemsErrorIcon.foreground": "error",
  "problemsWarningIcon.foreground": "warning",
  "problemsInfoIcon.foreground": "info",
  "testing.iconPassed": "success",
  "testing.iconFailed": "error",
  "terminal.ansiBlack": "terminalAnsiBlack",
  "terminal.ansiBrightBlack": "terminalAnsiBrightBlack",
  "terminal.ansiRed": "terminalAnsiRed",
  "terminal.ansiBrightRed": "terminalAnsiBrightRed",
  "terminal.ansiGreen": "terminalAnsiGreen",
  "terminal.ansiBrightGreen": "terminalAnsiBrightGreen",
  "terminal.ansiYellow": "terminalAnsiYellow",
  "terminal.ansiBrightYellow": "terminalAnsiBrightYellow",
  "terminal.ansiBlue": "terminalAnsiBlue",
  "terminal.ansiBrightBlue": "terminalAnsiBrightBlue",
  "terminal.ansiMagenta": "terminalAnsiMagenta",
  "terminal.ansiBrightMagenta": "terminalAnsiBrightMagenta",
  "terminal.ansiCyan": "terminalAnsiCyan",
  "terminal.ansiBrightCyan": "terminalAnsiBrightCyan",
  "terminal.ansiWhite": "terminalAnsiWhite",
  "terminal.ansiBrightWhite": "terminalAnsiBrightWhite"
};

// Keep the existing grammar coverage; specific scopes override generic ones.
const textMateRules: Array<{ name: string; token: string; scope: string[] }> = [
  {
    "name": "comment",
    "token": "comment",
    "scope": [
      "comment",
      "punctuation.definition.comment"
    ]
  },
  {
    "name": "comment.doc",
    "token": "commentDoc",
    "scope": [
      "comment.block.documentation",
      "comment.line.documentation",
      "comment.block.javadoc"
    ]
  },
  {
    "name": "keyword",
    "token": "keyword",
    "scope": [
      "keyword",
      "storage.type",
      "storage.modifier",
      "keyword.control",
      "variable.language.super"
    ]
  },
  {
    "name": "operator",
    "token": "operator",
    "scope": [
      "keyword.operator",
      "punctuation.accessor",
      "storage.type.function.arrow"
    ]
  },
  {
    "name": "string",
    "token": "string",
    "scope": [
      "string",
      "string.quoted",
      "string.template"
    ]
  },
  {
    "name": "string.escape",
    "token": "stringEscape",
    "scope": [
      "constant.character.escape",
      "constant.character.format.placeholder"
    ]
  },
  {
    "name": "string.regex",
    "token": "stringRegex",
    "scope": [
      "string.regexp"
    ]
  },
  {
    "name": "string.special.symbol",
    "token": "stringSpecialSymbol",
    "scope": [
      "constant.other.symbol"
    ]
  },
  {
    "name": "number",
    "token": "number",
    "scope": [
      "constant.numeric"
    ]
  },
  {
    "name": "boolean",
    "token": "boolean",
    "scope": [
      "constant.language.boolean",
      "constant.language.null",
      "constant.language.undefined",
      "constant.language"
    ]
  },
  {
    "name": "constant",
    "token": "constant",
    "scope": [
      "constant",
      "variable.other.constant",
      "variable.other.enummember",
      "support.constant"
    ]
  },
  {
    "name": "function",
    "token": "function",
    "scope": [
      "entity.name.function",
      "support.function",
      "meta.function-call.generic",
      "variable.function"
    ]
  },
  {
    "name": "constructor",
    "token": "constructor",
    "scope": [
      "entity.name.function.constructor",
      "new.expr entity.name.type"
    ]
  },
  {
    "name": "type",
    "token": "type",
    "scope": [
      "entity.name.type",
      "entity.name.class",
      "entity.name.struct",
      "entity.name.interface",
      "support.type",
      "support.class",
      "entity.other.inherited-class",
      "storage.type.primitive",
      "storage.type.built-in"
    ]
  },
  {
    "name": "enum",
    "token": "enum",
    "scope": [
      "entity.name.type.enum"
    ]
  },
  {
    "name": "tag",
    "token": "tag",
    "scope": [
      "entity.name.tag",
      "meta.tag.sgml"
    ]
  },
  {
    "name": "attribute",
    "token": "attribute",
    "scope": [
      "entity.other.attribute-name",
      "meta.decorator",
      "meta.attribute",
      "punctuation.decorator"
    ]
  },
  {
    "name": "variable",
    "token": "variable",
    "scope": [
      "variable",
      "variable.other",
      "variable.parameter",
      "meta.definition.variable"
    ]
  },
  {
    "name": "variable.special",
    "token": "variableSpecial",
    "scope": [
      "variable.language",
      "variable.language.this",
      "variable.language.self"
    ]
  },
  {
    "name": "property",
    "token": "property",
    "scope": [
      "variable.other.property",
      "variable.other.object.property",
      "support.variable.property",
      "meta.object-literal.key",
      "support.type.property-name",
      "entity.name.tag.yaml",
      "entity.name.tag.toml"
    ]
  },
  {
    "name": "label",
    "token": "label",
    "scope": [
      "entity.name.label",
      "punctuation.definition.label"
    ]
  },
  {
    "name": "preproc",
    "token": "preproc",
    "scope": [
      "meta.preprocessor",
      "keyword.control.directive",
      "keyword.control.import",
      "entity.name.function.preprocessor"
    ]
  },
  {
    "name": "punctuation",
    "token": "punctuation",
    "scope": [
      "punctuation"
    ]
  },
  {
    "name": "punctuation.bracket",
    "token": "punctuationBracket",
    "scope": [
      "punctuation.section",
      "punctuation.bracket",
      "meta.brace",
      "punctuation.definition.parameters",
      "punctuation.definition.block",
      "punctuation.definition.array"
    ]
  },
  {
    "name": "punctuation.delimiter",
    "token": "punctuationDelimiter",
    "scope": [
      "punctuation.separator",
      "punctuation.terminator"
    ]
  },
  {
    "name": "punctuation.special",
    "token": "punctuationSpecial",
    "scope": [
      "punctuation.definition.template-expression",
      "punctuation.section.embedded",
      "punctuation.definition.interpolation"
    ]
  },
  {
    "name": "punctuation.list_marker",
    "token": "punctuationListMarker",
    "scope": [
      "punctuation.definition.list",
      "markup.list punctuation.definition"
    ]
  },
  {
    "name": "embedded",
    "token": "embedded",
    "scope": [
      "meta.embedded",
      "source.groovy.embedded",
      "meta.template.expression"
    ]
  },
  {
    "name": "string.special",
    "token": "stringSpecial",
    "scope": [
      "string.other.link",
      "string.unquoted.heredoc"
    ]
  },
  {
    "name": "title",
    "token": "title",
    "scope": [
      "markup.heading",
      "entity.name.section",
      "markup.heading entity.name"
    ]
  },
  {
    "name": "emphasis",
    "token": "emphasis",
    "scope": [
      "markup.italic"
    ]
  },
  {
    "name": "emphasis.strong",
    "token": "emphasisStrong",
    "scope": [
      "markup.bold"
    ]
  },
  {
    "name": "link_text",
    "token": "linkText",
    "scope": [
      "string.other.link.title",
      "string.other.link.description"
    ]
  },
  {
    "name": "link_uri",
    "token": "linkUri",
    "scope": [
      "markup.underline.link"
    ]
  },
  {
    "name": "text.literal",
    "token": "textLiteral",
    "scope": [
      "markup.inline.raw",
      "markup.fenced_code",
      "markup.raw"
    ]
  }
];

// Use only standard token types/modifiers; custom language types fall back to TextMate.
const semanticSources: Record<string, string> = {
  "function": "function",
  "method": "function",
  "macro": "preproc",
  "class": "type",
  "interface": "type",
  "struct": "type",
  "type": "type",
  "typeParameter": "type",
  "enum": "enum",
  "enumMember": "constant",
  "property": "property",
  "variable": "variable",
  "parameter": "variable",
  "keyword": "keyword",
  "string": "string",
  "number": "number",
  "regexp": "stringRegex",
  "operator": "operator",
  "comment": "comment",
  "decorator": "attribute",
  "label": "label",
  "variable.readonly": "constant",
  "property.readonly": "constant",
  "comment.documentation": "commentDoc"
};

/** Export one neutral palette variant as a VS Code color theme. */
export function vscodeTheme(theme: Theme): VSCodeTheme {
  const color = (reference: string): string => resolve(theme, reference);
  const highlight = (token: string): Style => resolveHighlight(theme, token);
  const colors: Record<string, string> = Object.fromEntries(
    Object.entries(uiColorSources).map(([key, reference]) => [key, color(reference)]),
  );
  colors["selection.background"] = color(theme.players[0].selection);
  colors["textPreformat.foreground"] = highlight("textLiteral").foreground;
  colors["terminalCursor.foreground"] = color(theme.players[0].cursor);
  colors["terminal.selectionBackground"] = color(theme.players[0].selection);
  colors["editorCursor.foreground"] = color(theme.players[0].cursor);
  colors["editor.selectionBackground"] = color(theme.players[0].selection);

  return {
    $schema: 'vscode://schemas/color-theme',
    _comment: 'Modified by anjaloh for Madoe. Adapted from Grok Build with Tokyo Night accents; retains the locally installed palette. Generated from palette.json; edit the canonical source, not this file. See NOTICE for attribution.',
    name: theme.name,
    type: theme.appearance,
    semanticHighlighting: true,
    colors,
    tokenColors: textMateRules.map(({ name, token, scope }) => {
      const style = highlight(token);
      const fontStyle = [
        style.italic && 'italic',
        style.bold && 'bold',
        style.underline && 'underline',
      ].filter(Boolean).join(' ');
      return { name, scope: [...scope], settings: { foreground: style.foreground, fontStyle } };
    }),
    semanticTokenColors: Object.fromEntries(
      Object.entries(semanticSources).map(([selector, token]) => [selector, highlight(token)]),
    ),
  };
}
