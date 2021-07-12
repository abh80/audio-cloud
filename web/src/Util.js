export default class Util {
  /**
   *
   * @param {string} str
   * @param {number} len
   * @returns
   */
  static truncate(str, len) {
    if (str.length <= len) return str;
    return str.slice(0, len) + "...";
  }
}
