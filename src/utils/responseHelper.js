
class ApiResponse {
    constructor(res) {
        this.status = true;
        this.statusCode = 200;
        this.message = "";
        this.data = null;
        this.res = res;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    // Method to set error details
    setError(message, statusCode = 400) {
        this.status = false;
        this.statusCode = statusCode;
        this.message = message || "Internal server error.";
        this.data = null;
        return this;
    }

    // Method to send the response
    send() {
        return this.res.status(this.statusCode).json({
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        });
    }
}

module.exports = ApiResponse;
