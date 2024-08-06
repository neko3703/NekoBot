const path = require('path');
const express = require('express');


const app = express();

app.use('',express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('index.html', { root: 'https://nikibot.in/' });
});

const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
