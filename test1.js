import { x } from "x";

export const sayHi = () => {
  let response;

  runHiPromise().then((response) => {
    console.log(response);
    runChildPromise().then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }, (error) => {
    console.log(error);
  });
};

export const sayHello = () => {
  let response;

  runHelloPromise().then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });
};

// tried regex, doesn't work
// now trying to count
