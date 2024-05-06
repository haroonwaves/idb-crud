export default function createPlaceholderObject(original) {
  if (original === null || original === undefined) {
    return "placeholder";
  }

  if (Array.isArray(original)) {
    return []; // Return an empty array for array types
  }

  if (typeof original === "object") {
    let placeholder = {};
    for (let key in original) {
      if (original.hasOwnProperty(key)) {
        placeholder[key] = createPlaceholderObject(original[key]);
      }
    }
    return placeholder;
  }

  // For basic data types (like string, number, boolean), return null
  return "placeholder";
}
