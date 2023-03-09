class NotFound extends Error {
  constructor(id, type) {
    super();
    this.name = 'NotFound';
    this.statusCode = 404;
    this.message = `${type} with ID ${id} is not found`;
  }
}

module.exports = { NotFound };
