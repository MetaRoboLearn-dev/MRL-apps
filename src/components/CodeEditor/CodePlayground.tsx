import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from "monaco-editor"; // Import monaco types

const colours = {
  'background': '#fffbde',  // --color-sunglow-100
  'foreground': '#676767',  // --color-white-smoke-900
  'lineHighlightBackground': '#ffeb9e', // --color-sunglow-200
  'lineNumber.foreground': '#454949', // --color-dark-neutrals-400
  'lineNumber.activeForeground': '#101414', // --color-dark-neutrals-700

  'keyword': '#b43a30', // --color-tomato-700
  'comment': '#b49220', // --color-sunglow-700:
  'string': '#008e91', // --color-turquoise-700
}

const primjer = `# Primjer kretanja robota
broj_koraka = 1 + 2  # 3 koraka naprijed
for korak in range(broj_koraka):
naprijed()

rotiraj("desno")  # Robot se okreće desno

broj_koraka = 5 - 3  # 2 koraka naprijed
for korak in range(broj_koraka):
naprijed()

rotiraj("lijevo")  # Robot se okreće lijevo

koraci_nazad = 2 * 2  # 4 koraka nazad
while koraci_nazad > 0:
nazad()
koraci_nazad -= 1 
`

const CodePlayground = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("default", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: colours['keyword']},
        { token: "identifier", foreground: colours['foreground'] },
        { token: "number", foreground: colours['keyword'] },
        { token: "string", foreground: colours['string'] },
        { token: "comment", foreground: colours['comment']},
      ],
      colors: {
        "editor.background": colours['background'],
        "editor.foreground": colours['foreground'],
        "editorLineNumber.foreground": colours['lineNumber.foreground'],
        "editorLineNumber.activeForeground": colours['lineNumber.activeForeground'],
        "editorCursor.foreground": colours['foreground'],
        "editor.lineHighlightBackground": colours['lineHighlightBackground'],
      },
    });

    monaco.editor.setTheme('default')
  };

  return (
    <div className={'w-full flex-grow pt-2 pb-2.5'}>
      <Editor
        onMount={handleEditorDidMount}
        height="100%"
        defaultLanguage="python"
        defaultValue={primjer}
        theme="dark"
        options={{
          fontSize: 20,
          lineNumbers: "on",
          minimap: { enabled: false },
          padding: { top: 10 },

        }}
      />
    </div>
  );
};

export default CodePlayground;
