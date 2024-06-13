
//@desc   this class is responsible about operational errors {error that i can predict}
class ApiError extends Error {
  public status: "failed" | "error";
  isOperational: boolean;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;
  }
}

export default ApiError;
