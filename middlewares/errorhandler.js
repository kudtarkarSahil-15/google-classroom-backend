const errorHandler = (error,_,res,next) => {
    console.log(error.stack)

    if(res.headersSent) {
        return next(error)
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error'

    res.status(statusCode).json({ error: message})
}

module.exports = errorHandler