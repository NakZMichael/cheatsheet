export const jsonMiddleware = function () {
  return {
    inbound (message) {
      return JSON.parse(message.toString())
    },
    outbound (message) {
      return JSON.stringify(message)
      // return Buffer.from(JSON.stringify(message))
    }
  }
}
