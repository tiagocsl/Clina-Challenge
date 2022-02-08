const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swagger_output.json'
const endpointsFiles = ['./src/adapter/http/rest/router.ts']

swaggerAutogen(outputFile, endpointsFiles)