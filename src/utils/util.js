class Util {
    constructor() {
      this.status = false;
      this.statusCode = null;
      this.data = null;
      this.message = null;
    }
  
    sendError(res, statusCode, message) {
      this.status = false;
      this.statusCode = statusCode;
      this.error = message;
      return res.status(this.statusCode).json({ status: false, statusCode: this.statusCode, error: this.error });
    }
  
    sendSuccess(res, statusCode, data) {
      this.status = true,
      this.statusCode = statusCode;
      this.data = data;
      return res.status(statusCode).json({ status: true, statusCode: this.statusCode, data: this.data });
    }
  }
  
  module.exports = new Util();