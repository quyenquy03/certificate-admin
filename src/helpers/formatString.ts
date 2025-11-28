export const getLastWordCapitalized = (str: string) => {
  if (!str || str.trim() === "") return "";

  const parts = str.trim().split(/\s+/);
  const lastWord = parts[parts.length - 1];

  return lastWord.charAt(0).toUpperCase() + lastWord.slice(1);
};
