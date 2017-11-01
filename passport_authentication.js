const express = require('express')
const session = require('express-session')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const router = express.Router()
const port = 4000
const app = express()

const db = require('./model/model')
const user = require('./router/passport')
const passportLocal = require('./authentication/local')

const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tasmanianDevil'
}
let payload
// const token = jwt.sign(payload, jwtOptions.secretOrKey)
// jwtOptions.issuer = 'accounts.examplesoft.com'
// jwtOptions.audience = 'yoursite.net'


app.use((req, res, next) => {
    passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        if (req.session.status) {
            console.log('payload received', jwt_payload)
            // usually this would be a database call:
            const getUser = 'SELECT * FROM person WHERE id = ${id}'
            db.one(getUser, { id: jwt_payload.id })
                .then((data) => {
                    console.log('dang nhap roi')
                    console.log('data day', data)
                    return done(null, data)
                })
                .catch(err => {
                    console.log('da chay vao error')
                    return done(null, false)
                })
        } else {
            console.log('chua dang nhap')
            return done(null, false)
        }
    }))
    next()
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 300000
    }
}))


/////////////////////////////////////////////
app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,

})
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

////////////////////////////////////////////////


app.use(passport.initialize());
app.use(passport.session());

passportLocal(passport, bcrypt, Strategy)

passport.serializeUser(function (data, cb) {
    console.log('serializeUser', data.email)
    cb(null, data.email)
})

passport.deserializeUser(function (email, cb) {
    // console.log('deserializeUser', email)
    const getUser = 'SELECT * FROM person WHERE email = ${email}'
    db.one(getUser, { email: email })
        .then(data => {
            cb(null, data)
        })
        .catch(err => {
            return cb(err)
        })
})

app.use(flash())
app.use((req, res, next) => {
    // console.log('req user 1', req.user)
    // https://stackoverflow.com/questions/15057857/node-js-express3-middleware-to-add-render-data-to-all-render-requests
    // https://stackoverflow.com/questions/12658175/how-to-pass-data-to-every-view-in-express-3
    // https://stackoverflow.com/questions/14642692/app-locals-and-res-locals-life-cycle
    if (req.user && !req.session.status) {
        req.session.status = true
        payload = { id: req.user.id, group: 'customer' }
        const token = jwt.sign(payload, jwtOptions.secretOrKey)
        res.locals.token = token
        console.log('token', token)
    }
    next()
})

app.use(router)
user(router, passport, bcrypt, jwt)

app.listen(port, function () {
    console.log(`server on running on port ${port}!`)
})


