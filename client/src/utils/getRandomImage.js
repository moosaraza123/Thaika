// src/utils/getRandomImage.js

/**
 * Get a random item from an array.
 * @param {Array} array - The array to choose from.
 * @returns {any} A random item from the array, or null if the array is empty or undefined.
 */
export const getRandomImage = (array) => {
    if (!array || array.length === 0) {
      return null; // Return null if the array is empty or not defined
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex]; // Return a random item from the array
  };
  