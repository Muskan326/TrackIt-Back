/* response generation library for api */
let generate = (err,status,message, data) => {
    let response = {
      error: err,
      status: status,
      message: message,
      data: data
    }
    return response
  }
  
  module.exports = {
    generate: generate
  }
  