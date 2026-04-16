import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select
            className="select select-sm font-semibold"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm gap-2"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="neonDark"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("neonDark", {
              base: "vs-dark",
              inherit: true,

              rules: [
                { token: "comment", foreground: "5C6370", fontStyle: "italic" },
                { token: "keyword", foreground: "FF6BCB", fontStyle: "bold" },
                { token: "string", foreground: "98C379" },
                { token: "number", foreground: "D19A66" },
                { token: "function", foreground: "61AFEF" },
                { token: "variable", foreground: "E06C75" },
                { token: "type", foreground: "E5C07B" },
              ],

              colors: {
                "editor.background": "#14110F",
                "editor.foreground": "#ABB2BF",

                "editorCursor.foreground": "#FFCC00",
                "editor.lineHighlightBackground": "#1A1D2E",

                "editorLineNumber.foreground": "#5C6370",
                "editorLineNumber.activeForeground": "#FFFFFF",

                "editor.selectionBackground": "#3E4451",
                "editor.inactiveSelectionBackground": "#2C313A",

                "editorIndentGuide.background": "#2C313A",
                "editorIndentGuide.activeBackground": "#3E4451",

                "editorBracketMatch.background": "#2D3149",
                "editorBracketMatch.border": "#61AFEF",

                "scrollbarSlider.background": "#3A3F4B",
                "scrollbarSlider.hoverBackground": "#4E5666",

                "editorSuggestWidget.background": "#1A1D2E",
                "editorSuggestWidget.border": "#2C313A",
              },
            });
          }}
          options={{
            fontSize: 16,
            fontLigatures: true, // 🔥 looks premium
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            minimap: { enabled: false },
            padding: { top: 10 },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
