var fs = require('fs');

const [filename] = [...process.argv].reverse();
console.log("\n===================");
console.log(filename, "\n===================");

fs.readFile(filename, 'utf8', function(err, contents) {
  const results = contents.match(/.then(([.*]) => {[\s\S]*}.*)/gi);

  if (!results) {
    console.log("no results found.");
    return;
  }

  results.forEach((result, i) => {
    console.log("i:", i, "\n-------\n", result, "\n-------");
  });
});
