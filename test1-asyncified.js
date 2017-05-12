import { x } from "x";

export const sayHi = async () => {
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
  try {
    const runHelloPromiseResponse = await runHelloPromise();
    console.log(runHelloPromiseResponse);
  } catch (error) => {
    console.log(error);
  }
};
