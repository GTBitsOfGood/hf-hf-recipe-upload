import { useRef, useState } from 'react';
import mammoth from 'mammoth';
import { parseRecipe } from './util';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const readFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files == null) {
      setFiles([]);
      return;
    }
    const fileArr = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file != null) {
        fileArr.push(file);
      }
    }
    setFiles(fileArr);
  };

  const readerLoadEnd = (e: ProgressEvent<FileReader>) => {
    if (e.target == null) return;
    const arrayBuffer = e.target.result;

    (async () => {
      const r = await mammoth.convertToHtml({ arrayBuffer });
      parseRecipe(r.value);
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
      <input type="file" onChange={readFiles} multiple />
      <button onClick={parseFiles}>boop</button>

      <div ref={outputRef}></div>
    </div>
  );
}

export default App;
