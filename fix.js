const fs = require('fs');

const filePath = 'index.html';
let content = fs.readFileSync(filePath, 'utf8');

// I will extract from <nav class="navbar" id="navbar"> to <!-- 3. Sustainability Highlights -->
// Actually, it's safer to just overwrite index.html entirely using a script, or just run a regex that captures everything between <nav class="navbar" id="navbar"> to <section class="section bg-light" id="services">.
