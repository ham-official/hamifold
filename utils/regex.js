export const patterns = {
  fullName: "^[a-zA-ZÀ-ÿs]{3,}$",
  schoolId: /(?<!\d)\d{1,8}(?!\d)/g,
  email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
  password: /^(?=\S{8,})/, //This pattern requires at least one letter, one number, and a minimum length of eight characters.
  notEmptyString: /\S/,
  slug: /^[a-z](-?[a-z])*$/,
  walletAddress: /^0x[a-fA-F0-9]{40}$/g,
  mobileDevices:
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|Fennec|PlayBook|BB10|MeeGo|mobile/i,
};

export const testRegex = (pattern, text) => {
  const regex = new RegExp(pattern);
  return regex.test(text);
};
