/*
 *  This is a mock file used for tests in the proces sof developing Asyncify
 */

// Mock import
import { x } from "x";

// ORIGINAL:
export const sayHello = () => {
  runHelloPromise().then((response) => {
    console.log(response);
  }, (error) => {
    console.error(error);
  });
};

// // ASYNCIFIED:
// export const sayHello = async () => {
//   try {
//     const runHelloPromiseResponse = await runHelloPromise();
//     console.log(runHelloPromiseResponse);
//   } catch (error) => {
//     console.log(error);
//   }
// };

// Steps:
//
// [DONE] 1. identify promises (tried regex didn't work, now counting parantheses)
// [DONE] 2. extract promise contents (`.then(successCb() {...}, errorCb() {...})`),
// 3. add `async` keyword to parent function
// 4. save (awaited) result in a const (name preferably `${method}Result`)
// 5. add `await` keyword before invocation
// 6. wrap promise in try/catch block
// 7. put contents of resolve block next to the `await` line,
// 8. put contents of the error block in the `catch` block.
