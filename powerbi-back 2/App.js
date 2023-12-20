import express from 'express';
import bodyParser from 'body-parser';
import csvParser from 'csv-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.post('/convert-csv-to-json', async (req, res) => {
  const fileName = 'output.csv';
  const filePath = `./saved-csv/${fileName}`;

  try {
    const jsonData = await convertCsvToJson(filePath);

    // (Optional) You can perform additional operations here if needed.
    const cleanedCsvData = jsonData.map((row) => /* Perform cleaning operation if necessary */ row);

    // Limit the number of rows in the JSON response
    const limitedJsonData = jsonData.slice(0, 10); // Adjust the number as needed

    // Save the cleaned JSON data to a new file
    const cleanedFilePath = `./saved-csv/cleaned-${fileName}`;
    fs.writeFileSync(cleanedFilePath, JSON.stringify(cleanedCsvData, null, 2));

    // Send the limited JSON response
    res.json({ data: limitedJsonData });
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
    return res.status(500).send('Internal Server Error');
  }

  // Move the file download outside the try-catch block
  try {
    // Send the cleaned file as a response
    res.download(cleanedFilePath, (err) => {
      if (err) {
        console.error('Error sending cleaned file:', err);
        // Handle the error, you might want to send an error response here
      }
    });
  } catch (error) {
    console.error('Error sending cleaned file:', error);
    // Handle the error, you might want to send an error response here
  }
});

  
  // ...

// Fonction pour convertir un fichier CSV en JSON
const convertCsvToJson = (filePath) => {
  return new Promise((resolve, reject) => {
    const jsonData = [];

    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';', headers: true, mapHeaders: ({ header }) => header.trim() })) // Spécifiez le délimiteur et utilisez les en-têtes
      .on('data', (row) => {
        jsonData.push(row);
      })
      .on('end', () => {
        resolve(jsonData);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};




app.post('/convert-csv-to-json', async (req, res) => {
  const fileName = 'output.csv';
  const filePath = `./saved-csv/${fileName}`;

  try {
    const jsonData = await convertCsvToJson(filePath);
    res.json({ data: jsonData });
    
    // Sauvegarder le CSV nettoyé dans un nouveau fichier
    const cleanedFilePath = `./saved-csv/cleaned-${fileName}`;
    fs.writeFileSync(cleanedFilePath, cleanedCsvData.join('\n'));
  
    res.download(cleanedFilePath);
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/clean-csv',  (req, res) => {
    const fileName = 'output.csv';
    const filePath = `./saved-csv/${fileName}`;
  
    // Lire le fichier CSV
    const csvData = fs.readFileSync(filePath, 'utf8').split('\n');
  
    // Nettoyer les données (exemple : supprimer les lignes vides)
    const cleanedCsvData = csvData.filter((row) => row.trim() !== '');
  
    // Sauvegarder le CSV nettoyé dans un nouveau fichier
    const cleanedFilePath = `./saved-csv/cleaned-${fileName}`;
    fs.writeFileSync(cleanedFilePath, cleanedCsvData.join('\n'));
  
    res.download(cleanedFilePath);
  });
  
  app.post('/modify-csv', (req, res) => {
    const fileName = 'output.csv';
    const filePath = `./saved-csv/${fileName}`;
  
    // Lire le fichier CSV
    const csvData = fs.readFileSync(filePath, 'utf8').split('\n');
  
    // Modifier les données (exemple : ajouter "Modified" à chaque ligne)
    const modifiedCsvData = csvData.map((row) => row.trim() + ',Modified');
  
    // Sauvegarder le CSV modifié dans un nouveau fichier
    const modifiedFilePath = `./saved-csv/modified-${fileName}`;
    fs.writeFileSync(modifiedFilePath, modifiedCsvData.join('\n'));
  
    res.download(modifiedFilePath);
  });
  

// Fonction pour lire le contenu d'un fichier CSV
const readCsvFile = (filePath)=> {
  return new Promise((resolve, reject) => {
    const rows= [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Vous pouvez traiter chaque ligne ici si nécessaire
        rows.push(JSON.stringify(row));
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};


app.post('/read-csv',  async (req, res) => {
  const fileName = 'output.csv';
  const filePath = `./saved-csv/${fileName}`;

  try {
    const csvData = await readCsvFile(filePath);
    res.json({ data: csvData });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
