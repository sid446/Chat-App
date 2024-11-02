class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        stack=""

    ){
        super(message)
        this.data=null
        this.statusCode=statusCode
        this.message=message
        this.success=this.success
        this.errors=errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}