import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { parseRecipe } from './parseRecipe';
import { getMatchingRecipe } from './contentful';
import StyledDropzone from './StyledDropzone';

function App() {
  const [files, setFiles] = useState<File[]>([]);

  // const readFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { files } = e.target;
  //   if (files == null) {
  //     setFiles([]);
  //     return;
  //   }
  //   const fileArr = [];
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files.item(i);
  //     if (file != null) {
  //       fileArr.push(file);
  //     }
  //   }
  //   setFiles(fileArr);
  // };

  useEffect(() => {}, [files]);

  const readerLoadEnd = (e: ProgressEvent<FileReader>) => {
    if (e.target == null) return;
    const arrayBuffer = e.target.result;

    (async () => {
      const r = await mammoth.convertToHtml({ arrayBuffer });
      const recipe = parseRecipe(r.value);
      const matching = await getMatchingRecipe(recipe);
      if (matching != null) {
        console.log(`A Contentful entry already exists for ${recipe.title}`);
      }
    })();
  };

  const parseFiles = () => {
    if (files.length === 0) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = readerLoadEnd;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="App">
      {/* <input type="file" onChange={readFiles} multiple /> */}
      <StyledDropzone setFiles={setFiles} />
      <button onClick={parseFiles}>boop</button>
      <div className="output"></div>
      {files.map((file, i) => (
        <div key={i}>
          <pre>{file.name}</pre>
        </div>
      ))}
    </div>
  );
}

export default App;
