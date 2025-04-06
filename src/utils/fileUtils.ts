/**
 * Extracts filename from a full file path
 * @param path Full file path
 * @returns Filename with extension
 */
export const getFileName = (path: string): string => {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1];
};
