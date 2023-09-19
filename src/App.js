import React, { useState } from 'react';
import PDFViewer from './component/PDFViewer';
import { useDropzone } from 'react-dropzone';

function App() {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="App">
      <h1>PDF Viewer with Search</h1>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag and drop a PDF file here, or click to select one</p>
      </div>
      {file && <PDFViewer file={file} />}
    </div>
  );
}

export default App;
