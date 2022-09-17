module.exports = (node, graph) => {
  // This node will take your name as input parameter and display alert message
  // repating it N-times

  // Input name of type string
  const nameIn = node.in("name", "");

  // repeatNumber of type Number
  const repeatNumberIn = node.in("repeatNumber", 1, {
    min: 0,
    max: 10,
    // round number to 0 digits after the decimal point
    // effectively allowing only integers as a value
    precision: 0,
  });

  // Because second parameter (default value) is a function this will display
  // a button in the inspector. Clicking the button will call provided function.
  const sayItBtn = node.in("Say it!", sayIt);

  // variable to store our message to be displayed on sayIt button click
  let message = "";

  function sayIt() {
    // split message into multiple lines after each explanation mark for readability
    node.comment = message.replace(/! /g, "\n");

    // display message in the Log inspector panel
    node.log(message);

    // show browser alert with the message
    console.log(message);
  }

  // because we have two parameters (name and repeatNumber) that influence
  // the message it's better to put shared code in one function that will
  // be called whenver either of them changes
  function update() {
    const name = nameIn.value;
    const repeatNumber = repeatNumberIn.value;

    message = `Hello ${name}! 🥰`.repeat(repeatNumber);
  }

  // call update whenever either of those ports change
  nameIn.onChange = update;
  repeatNumberIn.onChange = update;
};
