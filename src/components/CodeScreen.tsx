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

const CodeScreen = () => {
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
    <div className="bg-emerald-400 w-3/5 flex items-center">
      <Editor
        onMount={handleEditorDidMount}
        height="100vh"
        defaultLanguage="python"
        defaultValue="from pymongo import MongoClient

# Define the MongoDB collection name.
collection_name = 'Product'

schema = {
    'name': {
        'type': str,
        'required': True
    },
    'description': {
        'type': str
    },
    'timestamps': True
}

# Connect to MongoDB. Replace with your connection string and database name.
client = MongoClient('your_mongodb_connection_string')
db = client['your_database_name']
collection = db[collection_name]

def insert_product(name, description=None):
    if not name:
        raise ValueError(Product name is required.)
    product_data = {
        'name': name,
        'description': description
    }
    result = collection.insert_one(product_data)
    return result


# Close the MongoDB connection.
client.close()
"
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
