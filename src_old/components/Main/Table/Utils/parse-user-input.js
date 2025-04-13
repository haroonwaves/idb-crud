export function parseUserInput(input) {
  if (input === "null") {
    return null;
  }

  if (input === "undefined") {
    return undefined;
  }

  // Adding a regex to better validate numeric values, including integers, floats, and scientific notation
  const isNumeric = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i;
  if (isNumeric.test(input)) {
    const number = parseFloat(input);
    if (!isNaN(number)) {
      return number; // Return as number if it's a valid number
    }
  }

  if (input === "true") {
    return true;
  }
  if (input === "false") {
    return false;
  }

  return input;
}
