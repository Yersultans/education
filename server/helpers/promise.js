const to = promise =>
  promise.then(data => [null, data]).catch(err => [err.message, null]);

module.exports = { to };
