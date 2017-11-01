// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken')

const payload = {foo: 'bar'}
const secret = 'shhhh'
const token = jwt.sign(payload, secret)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1MDg5MDU0NDJ9.yLnEAQ727pCOV4Ijm8C7_8I4rSLPB-qO-W09hFQ7YdE
console.log(`token is: ${token}`)