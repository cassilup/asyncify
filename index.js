var fs = require('fs');

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

  for (let position = 0; position < contents.length; position++) {
    const character = contents[position];
    let newPharantesis;

    switch (character) {
      case "(":
        if (contents.substr(position - 5, 5) === ".then") {
          // newPharantesis = { char: "(", position, level, isPromise: true };
          insideAPromise++;
          promiseStart.push({ position, level });
        // } else {
        //   newPharantesis = { char: "(", position, level };
        }
        level++;
        break;
      case ")":
        level--;
        if (insideAPromise && promiseStart[promiseStart.length - 1].level == level) {
          const lastPromiseStart = promiseStart.pop();
          insideAPromise--;
          console.log(`!!!!!!!!!!!!!!!!!!!!!! Identified a promise: ${lastPromiseStart.position + 1}->${position}`);
          console.log(contents.substr(lastPromiseStart.position + 1, position - lastPromiseStart.position));
        }
        // newPharantesis = { char: ")", position, level };
        break;
    }

    // if (newPharantesis) {
    //   parantheses.push(newPharantesis);
    // }
  }

  // parantheses.forEach((result, i) => {
  //   let spaces = "";
  //   for (let j = 0; j < parseInt(result["level"], 10); j++) {
  //     spaces += " » ";
  //   }
  //   console.log(`${spaces}i: ${i}\n${spaces}-------\n${spaces}${JSON.stringify(result)}\n${spaces}-------`);
  // });
});

// tried regex, doesn't work
// now trying to count "(" and ")".
