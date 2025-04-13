export default function calculateColumnNames(array) {
  const columnNames = [];
  for (const row of array) {
    for (const columnName in row) {
      if (!columnNames.includes(columnName)) {
        columnNames.push(columnName);
      }
    }
  }
  return columnNames;
}
