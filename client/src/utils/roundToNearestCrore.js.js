/**
 * Rounds a number in crores to the nearest standard value.
 * If below 0.25, round to 0.5. If above 0.75, round to the next whole number.
 * @param {number} value - The input value in crores.
 * @returns {number} The rounded value in crores.
 */
export const roundToNearestCrore = (value) => {
    if (value < 0.25) {
      return 0.5;
    } else if (value > 0.75) {
      return Math.ceil(value);
    } else {
      return Math.round(value * 2) / 2; // Round to nearest 0.5
    }
  };