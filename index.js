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
            colors.yellow("[!]")+` Identified a promise: ` +
            colors.yellow(`${lastPromiseStart.line}:${lastPromiseStart.position - lineStartPositions[lastPromiseStart.line - 2] - 1}`) +
            ` -> ` +
            colors.yellow(`${line}:${position - lineStartPositions[line - 2] + 1}`)
          );

          console.log(
            colors.gray(contents.substr(lineStartPositions[lastPromiseStart.line - 2], lastPromiseStart.position - lineStartPositions[lastPromiseStart.line - 2] + 1)) +
            colors.yellow(contents.substr(lastPromiseStart.position + 1, position - lastPromiseStart.position - 1)) +
            colors.gray(contents.substr(position, 1)) + "\n\n" +
            colors.cyan("BECOMES:\n\n") +
            colors.green("await " + contents.substr(lineStartPositions[lastPromiseStart.line - 2], lastPromiseStart.position - lineStartPositions[lastPromiseStart.line - 2] - 5).trim()) +
            "\n\n"
          );
        }
        break;
    }
  }
});
