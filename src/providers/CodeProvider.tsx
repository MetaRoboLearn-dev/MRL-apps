import {PropsWithChildren, useState} from "react";
import {CodeContext} from "./Context.tsx";

export const CodeProvider = ({ children }: PropsWithChildren) => {
  const [code, setCode] = useState<string>(primjer);
  return (
    <CodeContext.Provider value={{
      code, setCode
    }}>
      {children}
    </CodeContext.Provider>
  );
};

const primjer = `print("lijevo") # rotiraj_lijevo()

broj_koraka = 1 + 1  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed") # naprijed()

print("desno") # rotiraj_desno()

broj_koraka = 1 + 2  # 3x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("desno")

broj_koraka = 2 * 2  # 4x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("lijevo")

broj_koraka = 2  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("lijevo")

broj_koraka = 2  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed")`;
