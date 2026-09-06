const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, 'public', 'examples');
const examples = fs.readdirSync(examplesDir).filter(f => fs.statSync(path.join(examplesDir, f)).isDirectory());

const result = examples.map(ex => {
    const files = fs.readdirSync(path.join(examplesDir, ex))
        .filter(f => f.endsWith('.c') || f.endsWith('.h'));
    return {
        name: ex,
        files: files
    };
});

fs.writeFileSync(path.join(__dirname, 'public', 'examples.json'), JSON.stringify(result, null, 2));
console.log('examples.json generated');
