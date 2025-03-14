import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from "monaco-editor"; // Import monaco types

const CodeScreen = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("default", {
      base: "vs-dark", // Osnovna tema (možeš probati i "vs")
      inherit: true,
      rules: [
        { token: "keyword", foreground: "483d8b", fontStyle: "bold" }, // Tamnoplava (npr. `for`, `in`, `range`)
        { token: "identifier", foreground: "000000" }, // Crni tekst (varijable, funkcije)
        { token: "number", foreground: "8b0000" }, // Tamnocrvena za brojeve
        { token: "string", foreground: "228B22" }, // Zelena za stringove
        { token: "comment", foreground: "808080", fontStyle: "italic" }, // Siva za komentare
      ],
      colors: {
        "editor.background": "#c4a98b", // Bež pozadina (prilagodi ako treba)
        "editor.foreground": "#000000", // Crni osnovni tekst
        "editorLineNumber.foreground": "#5a4f3f", // Smeđa za brojeve linija
        "editorLineNumber.activeForeground": "#000000", // Crna za aktivni broj linije
        "editorCursor.foreground": "#ff4500", // Narančasta boja kursora
      },
    });

    monaco.editor.setTheme('vs-dark')
  };

  return (
    <div className="bg-emerald-400 w-3/5 flex items-center">
      <Editor
        onMount={handleEditorDidMount}
        height="100vh"
        defaultLanguage="python"
        defaultValue="// some comment"
        theme="dark"
        options={{
          fontSize: 22,
          lineNumbers: "on",
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default CodeScreen;
