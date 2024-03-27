/****
 * async error monitor
 * could be replaced with express-async-errors package declared globaly
 * */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
