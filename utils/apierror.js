class apierror extends Error {
    constructor(statusCode, message="Something went wrong",error =[],
      stack = "") {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.error = error;
      this.data = null;
  
      if(stack)  {
          this.stack = stack;
      } else{
          Error.captureStackTrace(this, this.constructor);	
      }
      
    }
  }
  export {apierror}