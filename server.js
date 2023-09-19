const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/api/openai-search', async (req, res) => {
  try {
    const { searchQuery, pdfText } = req.body;

    // Define the documents array with your PDF text
    const documents = [pdfText];

    // Make a POST request to the /search/completions endpoint
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/engines/davinci/search/completions', // Use the /search/completions endpoint
      {
        documents,
        query: searchQuery,
      },
      {
        headers: {
          Authorization: 'Bearer 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', // Replace with your OpenAI API key
        },
      }
    );

    const answers = openaiResponse.data.choices; // Access search results
    res.json({ answers });
  } catch (error) {
    console.error('Error searching with OpenAI:', error.response.data);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
