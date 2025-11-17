/**
 * Convert row number (1, 2, 3...) to letter (A, B, C...)
 * Example: 1 -> A, 2 -> B, 26 -> Z, 27 -> AA
 */
export function rowNumberToLetter(rowNum: number): string {
  if (rowNum < 1) return "";

  let result = "";
  let num = rowNum;

  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }

  return result;
}

/**
 * Convert letter (A, B, C...) to row number (1, 2, 3...)
 * Example: A -> 1, B -> 2, Z -> 26, AA -> 27
 */
export function letterToRowNumber(letter: string): number {
  let result = 0;

  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }

  return result;
}

/**
 * Generate array of row labels (A, B, C... Z, AA, AB...)
 */
export function generateRowLabels(rowCount: number): string[] {
  const labels: string[] = [];
  for (let i = 1; i <= rowCount; i++) {
    labels.push(rowNumberToLetter(i));
  }
  return labels;
}
