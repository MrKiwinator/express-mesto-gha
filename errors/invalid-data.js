class InvalidData extends Error {
  constructor() {
    super();
    this.name = 'InvalidData';
    this.statusCode = 400;
    this.message = 'Invalid data sent';
  }
}

module.exports = { InvalidData };
