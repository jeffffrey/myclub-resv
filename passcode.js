var dv = require('dv');
var fs = require('fs');

var filename = process.argv[2];
var image = new dv.Image('png', fs.readFileSync(filename));
var tesseract = new dv.Tesseract('eng', image);
tesseract.tessedit_char_whitelist = "0123456789";
console.log(tesseract.findText('plain').trim());
