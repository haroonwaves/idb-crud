export function parseUserInput(input) {
  if (input === "null") {
    return null;
  }

  if (input === "undefined") {
    return undefined;
  }

  const number = parseFloat(input);
  if (!isNaN(number)) {
    return number; // Return as number if it's a valid number
  }

  if (input === "true") {
    return true;
  }
  if (input === "false") {
    return false;
  }

  return input;
}
