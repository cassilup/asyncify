var fs = require('fs');
var colors = require('colors');

if (process.argv.length < 3) {
  console.error("You must pass a filename as a parameter.");
  return;
} else if (process.argv.length > 3) {
  console.error("asyncify only supports parsing a single file for now.");
  return;
}

// grab filename given as paramater
const [filename] = [...process.argv].reverse();

console.log(`===================\nParsing ${filename}\n===================`);

fs.readFile(filename, 'utf8', function(err, contents) {
  // let parantheses = [];
  let level = 0;
  let insideAPromise = 0;
  let lastPromiseLevel;
  let promiseStart = [];
  let line = 1;
  let lineStartPositions = [];
  let insideADoubleSlashComment;

  for (let position = 0; position < contents.length; position++) {
    const character = contents[position];
    let newPharantesis;

    if (character === "\n") {
      line++;
      lineStartPositions.push(position);

      // reset doubleSlashComment mode if enabled
      insideADoubleSlashComment = false;
    }

    if (insideADoubleSlashComment) { continue; }

    // if "//"
    if (character === "/" && contents[position + 1] === "/") {
      insideADoubleSlashComment = true;
    }

    switch (character) {
      case "(":
        if (contents.substr(position - 5, 5) === ".then") {
          insideAPromise++;
          promiseStart.push({ position, level, line });
        }
        level++;
        break;
      case ")":
        level--;
        if (insideAPromise && promiseStart[promiseStart.length - 1].level === level) {
          const lastPromiseStart = promiseStart.pop();
          insideAPromise--;
          console.log(
            `!!!!!!!!!!!!!!!!!!!!!! Identified a promise: ` +
            `${lastPromiseStart.line}:${lastPromiseStart.position - lineStartPositions[lastPromiseStart.line - 2] - 1}` +
            `->` +
            `${line}:${position - lineStartPositions[line - 2] + 1}`
          );

          console.log(
            colors.gray(contents.substr(lineStartPositions[lastPromiseStart.line - 2], lastPromiseStart.position - lineStartPositions[lastPromiseStart.line - 2] + 1)) +
            colors.green(contents.substr(lastPromiseStart.position + 1, position - lastPromiseStart.position))
          );
        }
        break;
    }
  }
});

// tried regex, doesn't work
// now trying to count "(" and ")".
