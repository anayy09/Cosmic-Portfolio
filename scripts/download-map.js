const fs = require('fs');
const https = require('https');

// Try a different reliable source for world map data
const url = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';
// const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
const outputPath = './public/worldmap.json';

console.log('Downloading world map data...');

https.get(url, (response) => {
  const { statusCode } = response;
  
  // Check if we received a successful response
  if (statusCode !== 200) {
    console.error(`Failed to download: HTTP status code ${statusCode}`);
    response.resume(); // Consume the response to free up memory
    return;
  }
  
  let data = '';
  
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', () => {
    // Make sure the directory exists
    const dir = './public';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, data);
    console.log(`World map data downloaded and saved to ${outputPath}`);
  });
}).on('error', (err) => {
  console.error('Error downloading world map data:', err.message);
});