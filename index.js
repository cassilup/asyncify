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

console.log(`\n\n===================\n `+colors.cyan(`Parsing ${filename}`)+ `\n===================\n`);

fs.readFile(filename, 'utf8', function(err, contents) {
  let level = 0;
  let insideAPromise = 0;
  let lastPromiseLevel;
  let promiseStart = [];
  let line = 1;
  let lineEndPositions = [];
  let insideADoubleSlashComment;

  for (let position = 0; position < contents.length; position++) {
    const character = contents[position];

    if (character === "\n") {
      lineEndPositions.push(position);
      line++;

      // reset doubleSlashComment mode if enabled
      insideADoubleSlashComment = false;
    }

    // if "//"
    if (character === "/" && contents[position - 1] === "/") {
      insideADoubleSlashComment = true;
    }
    if (insideADoubleSlashComment) continue;
    // TODO: Treat /**/ type comments

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

          // determine line end
          let promiseLineEndPosition;
          for (let tempPosition = position; tempPosition < contents.length; tempPosition++) {
            if (contents[tempPosition] === "\n") {
              promiseLineEndPosition = tempPosition;
              break;
            }
          }

          console.log(
            colors.yellow("[!]")+` Identified a promise: ` +
            colors.yellow(`${lastPromiseStart.line}:${lastPromiseStart.position - lineEndPositions[lastPromiseStart.line - 2] - 1}`) +
            ` -> ` +
            colors.yellow(`${line}:${position - lineEndPositions[line - 2] + 1}`)
          );

          console.log(
            colors.cyan("\n\nBEFORE:\n") +
            // show beginning of line until beginning of promise
            colors.gray(contents.substr(lineEndPositions[lastPromiseStart.line - 2], lastPromiseStart.position - lineEndPositions[lastPromiseStart.line - 2] + 1)) +
            // show promise contents
            colors.yellow(contents.substr(lastPromiseStart.position + 1, position - lastPromiseStart.position - 1)) +
            // show until the end of the line on which promise ends
            colors.gray(contents.substr(position, promiseLineEndPosition - position)) + "\n\n" +

            colors.cyan("\nAFTER:\n\n") +
            colors.green("await " + contents.substr(lineEndPositions[lastPromiseStart.line - 2], lastPromiseStart.position - lineEndPositions[lastPromiseStart.line - 2] - ".then".length).trim()) +
            "\n\n"
          );
        }
        break;
    }
  }
});
