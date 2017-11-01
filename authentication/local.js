module.exports = function (passport, bcrypt, Strategy) {
    const db = require('../model/model')
    /*
        passport.use('register', new Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, email, password, done) => {
            const getEmail = 'SELECT email FROM person WHERE email = ${email};'
            db.one(getEmail, {
                email: email
            })
                .then(data => {
                    if(data.email) return done(null, false, {message: 'Email này đã được đăng ký!'})   
                })
                .catch(err => {
                    return done(null, false)
                })
    
            if(password.length < 6) return done(null, false, {message: 'Mật khẩu phải dài hơn 6 ký tự!'})
    
            const saltRounds = 10
            const info = req.body
            const insertUser = 'INSERT INTO person(username,email,password) VALUES (${username}, ${email}, ${password});'
            bcrypt.hash(password, saltRounds, function (err, hash) {
                db.none(insertUser, {
                    username: info.username,
                    email: email,
                    password: hash
                })
                    .then(() => {
                        console.log('insert data success!')
                        return done(null, info.username) 
                    })
                    .catch(err => {
                        // return done(null, false)
                    })
            })
                     
        }))
    **/
    passport.use('login', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    }, (req, email, password, done) => {
        // console.log(email)
        const getUser = 'SELECT * FROM person WHERE email = ${email};'
        db.one(getUser, { email: email })
            .then(data => {
                // console.log(data)
                bcrypt.compare(password, data.password, (err, result) => {

                    if (err) return done(err)

                    if (!result) return done(null, false, req.flash('message', 'Sai mật khẩu!'))

                    return done(null, data, req.flash('message', 'Đăng nhập thành công!'))
                })
            })
            .catch(err => {
                console.error(err.message);
                return done(null, false, req.flash('message', 'Tài khoản này không tồn tại!'))
            })
    }
    ))

    // passport.use('session', new Strategy({
    //     passReqTocallback: true,
    //     session: false
    // }, (req, done) => {
    //     if(req.user) {
    //         console.log(req.user)
    //     }
    // }
    // ))
}