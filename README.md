# Sử dụng Connect-flash trong node.js.


# Passport trong node.js.
* Passport là 1 middleware của node.js dùng để xác thực thông tin mà gửi dùng gửi lên server.
* Để xác thực những request gửi đến ta dùng `passport.authenticate()`.
    * Chú ý: `Strategies` phải được cấu hình trước khi được sử dụng trong route.
    * `Redirect` dùng để chuyển hướng tới 1 trang khác sau khi xác thực 1 request:
        * `successRedirect`: Nếu xác thực thành công.
        * `failureRedirect`: Nếu xác thực thất bại.

# JWT là gì?

# Khi nào sử dụng JWT?
* Sử dụng cho REST API

# Tham khảo
* https://security.stackexchange.com/questions/101734/jwt-token-login-and-logout        
* https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout