module.exports = function (router, passport, bcrypt, jwt) {
    const db = require('../model/model')
    // const passportJWT = require('passport-jwt')
    // const ExtractJwt = passportJWT.ExtractJwt
    // const JwtStrategy = passportJWT.Strategy
    // const jwtOptions = {
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //     secretOrKey: 'tasmanianDevil'
    // }
    // const token = jwt.sign(payload, jwtOptions.secretOrKey)


    router.get('/', (req, res) => {
        // console.log('get-home', req.session)
        if (req.session.url !== req.url) req.session.url = req.url
        if (!req.user) {
            res.render('index', { message: req.flash('message') })
        } else {
            res.render('index', {
                info: req.user,
                message: req.flash('message'),
            })
        }

    })

    router.get('/demo1', (req, res) => {
        if (req.session.url !== req.url) req.session.url = req.url

        if (!req.user) {
            res.render('demo1', { message: req.flash('message') })
        } else {
            res.render('demo1', {
                info: req.user,
                message: req.flash('message')
            })
        }
    })

    router.get('/demo2', (req, res) => {
        if (req.session.url !== req.url) req.session.url = req.url

        if (!req.user) {
            res.render('demo2', { message: req.flash('message') })
        } else {
            res.render('demo2', {
                info: req.user,
                message: req.flash('message')
            })
        }
    })

    router.get('/register', (req, res) => {
        // console.log('get-register', req.session)
        res.render('register', { message: req.flash('message') })
    })

    router.post('/register', (req, res) => {
        const info = req.body
        const getEmail = 'SELECT email FROM person WHERE email = ${email};'
        db.one(getEmail, {
            email: info.email
        })
            .then(data => {
                if (data.email) {
                    req.flash('message', 'Email này đã được đăng ký!')
                    res.redirect('/register')
                }
            })
            .catch(err => {
                console.error(err.message);
            })

        const saltRounds = 10
        const insertUser = 'INSERT INTO person(username,email,password) VALUES (${username}, ${email}, ${password});'
        bcrypt.hash(info.password, saltRounds, (err, hash) => {
            if (info.password.length < 6) {
                req.flash('message', 'Mật khẩu phải dài hơn 6 ký tự!')
                res.redirect('/register')
            } else {
                db.none(insertUser, {
                    username: info.username,
                    email: info.email,
                    password: hash
                })
                    .then(() => {
                        console.log('insert data success!')
                        req.flash('message', 'Bạn đã đăng ký thành công!')
                        res.redirect('/login')
                        console.log('post-register', req.session)
                    })
                    .catch(err => {
                        console.error(err.message)
                    })
            }
        })
    })
    /*    
        router.post('/register', passport.authenticate('register', {
          successRedirect: '/login',
          failureRedirect: '/register',
          failureFlash: true  
        }))
    */
    /*
        router.post('/login', passport.authenticate('login', {
            // successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }), (req, res) => {
            const url = req.session.url
            console.log(url)
            if(url) res.redirect(url)
        })
    */
    router.post('/login', (req, res, next) => {
        // https://stackoverflow.com/questions/22858699/nodejs-and-passportjs-redirect-middleware-after-passport-authenticate-not-being
        passport.authenticate('login', (err, user, info) => {
            const url = req.session.url

            if (err) return next(err)
            // Redirect if it fails
            if (!user) return res.redirect(url)

            req.logIn(user, (err) => {
                if (err) return next(err)
                // Redirect if it succeeds
                return res.redirect(url)
            })
        })(req, res, next)
    })

    router.get('/notAllow', (req, res) => {
        res.render('notAllow')
    })
    /*
        router.post('/login', passport.authenticate('login', {
            // successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }), (req, res) => {
            const url = req.session.url
            console.log(url)
            if(url) res.redirect(url)
        })
    */
    router.get('/session', (req, res) => {
        if (!req.session.passport) {
            req.flash('Bạn phải đăng nhập!')
            res.redirect('/')
        } else {
            console.log(req.session)
        }
    })

    router.post('/jwt', passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/notAllow'
    }), (req, res) => {
        res.render('user', {
            info: req.user
        })
        // console.log(res.data)
        // res.json('ok')

    })

    // router.post('/jwt', (req, res) => {
    //     // res.json(req.headers)
    //     console.log(req.headers)
    // })

    router.get('/logout', (req, res) => {
        // console.log('get-logout', req.session)
        req.session.destroy()
        res.redirect('/')
    })
}