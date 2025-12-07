export const getLastWordCapitalized = (str: string) => {
  if (!str || str.trim() === "") return "";

  const parts = str.trim().split(/\s+/);
  const lastWord = parts[parts.length - 1];

  return lastWord.charAt(0).toUpperCase() + lastWord.slice(1);
};

const removeVietnameseTone = (str = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export const splitFamilyAndFirstName = (fullName = "", removeTone = false) => {
  if (!fullName.trim()) {
    return { familyName: "", firstName: "" };
  }

  let name = fullName.trim().split(/\s+/);

  let familyName = name[0];
  let firstName = name.slice(1).join(" ");

  if (removeTone) {
    familyName = removeVietnameseTone(familyName);
    firstName = removeVietnameseTone(firstName);
  }

  return { familyName, firstName };
};
