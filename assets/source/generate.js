const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const files = ['icon.svg', 'adaptive-icon.svg', 'splash.svg'];

for (const file of files) {
  const svg = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1024 },
    background: 'rgba(0,0,0,0)',
  });
  const png = resvg.render().asPng();
  const outName = file.replace('.svg', '.png');
  fs.writeFileSync(path.join(__dirname, outName), png);
  console.log('wrote', outName, png.length, 'bytes');
}
