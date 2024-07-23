
const createError = (msg , statusCode) => {
    let error = new Error()
    error.message = msg
    error.status = statusCode
    return error
}


export default createError  