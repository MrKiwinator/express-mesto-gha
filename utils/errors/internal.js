class InternalError extends Error {
  constructor() {
    super();
    this.name = 'InternalError';
    this.statusCode = 500;
    this.message = 'Произошла ошибка';
  }
}

module.exports = { InternalError };
