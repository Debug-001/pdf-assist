import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import UploadStats from "./UploadStats";
import axios from "axios";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfText, setPdfText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [performSearch, setPerformSearch] = useState(false);

  useEffect(() => {
    if (file) {
      setPdfUploaded(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = await extractTextFromPdf(event.target.result);
        setPdfText(text);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setPdfUploaded(false);
    }
  }, [file]);

  async function extractTextFromPdf(pdfData) {
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach((item) => {
        text += item.str + " ";
      });
    }
    return text;
  }

  useEffect(() => {
    if (performSearch) {
      if (!pdfUploaded) {
        alert("Please upload a PDF first.");
        setPerformSearch(false);
        return;
      }

      axios
        .post("http://localhost:3001/api/openai-search", {
          searchQuery: searchTerm,
          pdfText,
        })
        .then((response) => {
          if (
            response.data &&
            response.data.answers
          ) {
            const answers = response.data.answers;
            setSearchResults(answers);
          } else {
            console.error("Invalid response from OpenAI:", response);
            // Handle the response format error here
          }
        })
        .catch((error) => {
          console.error("Error searching with OpenAI:", error.response.data);
        });

      setPerformSearch(false);
    }
  }, [performSearch, searchTerm, pdfText, pdfUploaded]);

  function handleSearchInputChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchButtonClick() {
    setPerformSearch(true);
  }

  function togglePdfVisibility() {
    setPdfVisible(!pdfVisible);
  }

  return (
    <div>
      <UploadStats isUploaded={pdfUploaded} />
      <div>
        <input
          type="text"
          placeholder="Search PDF"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearchButtonClick}>Search</button>
      </div>
      <div>
        <button onClick={togglePdfVisibility}>
          {pdfVisible ? "Hide PDF" : "View PDF"}
        </button>
      </div>
      {pdfVisible && (
        <div className="pdf-container">
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      )}
      {pdfVisible && (
        <div>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
      <h3>Search Results:</h3>
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default PDFViewer;
