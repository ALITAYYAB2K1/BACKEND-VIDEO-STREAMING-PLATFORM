// Method 1
const asyncHandler = (requstHandler) => {
  return (req, res, next) => {
    Promise.resolve(requstHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
//Method 2
/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message || "An unknown error occurred!",
      });
    }
  };
*/
export { asyncHandler };

// what is higher order function?
// A higher-order function is a function that takes a function as an argument, or returns a function.
// Higher order functions are a result of functional programming.
// In functional programming, functions are first-class citizens. They can be assigned to variables, passed as arguments, and returned from other functions.
// Higher order functions are used to abstract, encapsulate, or isolate actions, effects, or properties of other functions.
// They allow us to write more modular, reusable code.

// demo of asyncHandler

// 1 const asyncHandler = () =>{};
// 2 const asyncHandler = (func) => () = {}
// 3 const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(error.code || 500).json({
//         success: false,
//         message: error.message || "An unknown error occurred!",
//       });
//     }
//   };
