import { x } from "x";

export const sayHi = async () => {
  let response;

  try () {
    const runHiPromiseResponse = await runHiPromise();
    console.log(runHiPromiseResponse);
    const runChildPromiseResponse = await runChildPromise();
    console.log(runChildPromiseResponse);
  } catch (error) {
    console.log(error);
  }
};

export const sayHello = async () => {
  let response;

  try {
    const runHelloPromiseResponse = await runHelloPromise();
    console.log(response);
  } catch (error) => {
    console.log(error);
  }
};
