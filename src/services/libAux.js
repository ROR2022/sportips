export const generateRandomCode =  () => {
    // Generate a random number between 1000 and 9999
    return Math.floor(Math.random() * 9999) + 1000;
  }

  export const generateUniqueId =  () => {
    const base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 24; i++) {
      id += base.charAt(Math.floor(Math.random() * base.length));
    }
    return id;
  }