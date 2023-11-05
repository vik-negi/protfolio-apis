class Utils {
  static randomPasswordGenerator = () => {
    const digits =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()+|}{[]?/=";
    let password = "";
    const passwordLength = 8;
    for (let i = 0; i < passwordLength; i++) {
      password += digits[Math.floor(Math.random() * digits.length)];
    }
    return password;
  };

  static generateUniqueUserName = (firstName, lastName) => {
    const baseUsername = `${firstName}${lastName}`;
    const currentDateTime = new Date();
    const suffix = currentDateTime
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(-10);
    console.log(
      `currentDateTime :: ${currentDateTime.toISOString()} && suffix :: ${suffix}`
    );

    // Combine the base username and the datetime-based suffix
    const username = `${baseUsername}-${suffix}`;

    return username;
  };
}

export default Utils;
