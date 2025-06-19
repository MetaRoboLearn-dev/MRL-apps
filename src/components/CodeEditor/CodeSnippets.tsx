import CodeSnippetEntry from "./CodeSnippetEntry.tsx";

interface Props{
  active: boolean;
}

const CodeSnippets = ({active}: Props) => {
  return (
    <div className={`bg-tomato-50 w-2/5 h-full py-5 absolute top-0 right-0 
                      flex flex-col items-start overflow-y-scroll overflow-x-hidden scrollbar-red
                      border-tomato-600 border-t-8 border-b-10 
                      transition duration-400 ease-in-out
                      ${active ? 'translate-x-0' : 'translate-x-full'}`}>

      <h1 className={'mb-5 w-full text-center font-display font-bold text-2xl tracking-wide text-dark-neutrals-400'}>Priručnik za korištenje!</h1>

      <CodeSnippetEntry title={'Uređivanje simulacije'}>
        dummy
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Napredbe za kretanje'}>
        <span className={'text-md'}> Kretanje automobila se postiže sljedećim naredbama: </span>
        <table
          cellPadding="8"
          cellSpacing="0"
          className="mx-auto table-auto mt-4 mb-8 border border-gray-300 rounded-md shadow-sm"
        >
          <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left border-b">Poziv u kodu</th>
            <th className="px-4 py-2 text-left border-b">Tip</th>
            <th className="px-4 py-2 text-left border-b">Smjer</th>
          </tr>
          </thead>
          <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b font-mono">
              <code>forward(duration, speed)</code>
            </td>
            <td className="px-4 py-2 border-b">Kretanje</td>
            <td className="px-4 py-2 border-b">Naprijed</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b font-mono">
              <code>back(duration, speed)</code>
            </td>
            <td className="px-4 py-2 border-b">Kretanje</td>
            <td className="px-4 py-2 border-b">Nazad</td>
          </tr>
          </tbody>
        </table>
        <span className={'text-justify'}>Dok se u simulaciji parametri funkcija za pomicanje zanemaruju, oni imaju veliku ulogu u kretanju robota. Prvi parametar funkcije određuje trajanje kretanja u sekundama, dok drugi definira brzinu.</span>
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Naredbe za rotiranje'}>
        dummy
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Matematičke funkcije'}>
        dummy
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Varijable u jeziku Python'}>
        dummy
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Petlje u jeziku Python'}>
        dummy
      </CodeSnippetEntry>
    </div>
  );
};

export default CodeSnippets;
