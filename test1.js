import { x } from "x";

export const sayHi = () => {
  let response;

  runPromise().then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });
};

export const sayHello = () => {
  let response;

  runPromise().then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });
};
