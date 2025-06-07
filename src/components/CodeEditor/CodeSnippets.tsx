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

      <h1 className={'mb-5 w-full text-center font-display font-bold text-2xl tracking-wide text-dark-neutrals-400'}>Priručnik za Python!</h1>

      <CodeSnippetEntry title={'For petlja'}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus, risus ut lacinia feugiat, ipsum ex blandit neque, et vestibulum est enim at quam. Phasellus vestibulum magna tempus, sagittis arcu a, iaculis lacus. Aliquam sed turpis risus. Integer vel neque non sem blandit varius eu sed erat. Aliquam erat volutpat. Suspendisse nec malesuada nunc. Nunc nulla justo, tristique ut lobortis eget, pharetra id orci. Morbi vitae orci varius enim dignissim luctus. Integer ultricies tortor a ipsum iaculis, ut dapibus sem suscipit. Sed hendrerit, mauris a lobortis fringilla, massa arcu rutrum velit, vitae ullamcorper nisi urna eu quam. Aenean viverra risus justo, mattis placerat dolor tincidunt eget. Pellentesque in venenatis nibh. Vivamus finibus vel enim et ultrices. Integer nulla justo, suscipit ac quam vitae, tristique eleifend tortor. Praesent volutpat semper ex, at aliquam ex ultrices id.
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'While petlja'}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus, risus ut lacinia feugiat, ipsum ex blandit neque, et vestibulum est enim at quam. Phasellus vestibulum magna tempus, sagittis arcu a, iaculis lacus. Aliquam sed turpis risus. Integer vel neque non sem blandit varius eu sed erat. Aliquam erat volutpat. Suspendisse nec malesuada nunc. Nunc nulla justo, tristique ut lobortis eget, pharetra id orci. Morbi vitae orci varius enim dignissim luctus. Integer ultricies tortor a ipsum iaculis, ut dapibus sem suscipit. Sed hendrerit, mauris a lobortis fringilla, massa arcu rutrum velit, vitae ullamcorper nisi urna eu quam. Aenean viverra risus justo, mattis placerat dolor tincidunt eget. Pellentesque in venenatis nibh. Vivamus finibus vel enim et ultrices. Integer nulla justo, suscipit ac quam vitae, tristique eleifend tortor. Praesent volutpat semper ex, at aliquam ex ultrices id.
      </CodeSnippetEntry>
      <CodeSnippetEntry title={'Do while petlja'}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus, risus ut lacinia feugiat, ipsum ex blandit neque, et vestibulum est enim at quam. Phasellus vestibulum magna tempus, sagittis arcu a, iaculis lacus. Aliquam sed turpis risus. Integer vel neque non sem blandit varius eu sed erat. Aliquam erat volutpat. Suspendisse nec malesuada nunc. Nunc nulla justo, tristique ut lobortis eget, pharetra id orci. Morbi vitae orci varius enim dignissim luctus. Integer ultricies tortor a ipsum iaculis, ut dapibus sem suscipit. Sed hendrerit, mauris a lobortis fringilla, massa arcu rutrum velit, vitae ullamcorper nisi urna eu quam. Aenean viverra risus justo, mattis placerat dolor tincidunt eget. Pellentesque in venenatis nibh. Vivamus finibus vel enim et ultrices. Integer nulla justo, suscipit ac quam vitae, tristique eleifend tortor. Praesent volutpat semper ex, at aliquam ex ultrices id.       </CodeSnippetEntry>
    </div>
  );
};

export default CodeSnippets;
