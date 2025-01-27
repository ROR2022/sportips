export const generateRandomCode =  () => {
    // Generate a random number between 1000 and 9999
    return Math.floor(Math.random() * 9999) + 1000;
  }