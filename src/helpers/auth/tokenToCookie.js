const {
  production
} = require('../../config')

function tokenToCookie(res, result, statusCode) {
  if (result.success) {
    const {
      token
    } = result
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: production,
        sameSite: 'none',
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      })
      .redirect('http://localhost:3000')
  }
  return res.status(statusCode).json(result)
}

function tokenToCookieLocal(res, result, statusCode) {
  if (result.success) {
    const {
      token
    } = result
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: production,
        sameSite: 'none',
        // domain: 'vercel.app',
        path: '/',
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      })
      .json(result.user)
  }
  return res.status(statusCode).json(result)
}

function deleteCookie(res) {
  res
    .cookie('token', null, {
      httpOnly: true,
      secure: production,
      sameSite: 'none',
      expires: new Date(),
    })
    .json({
      success: true,
      message: 'Successfully logged out',
    })
}

module.exports = {
  tokenToCookie,
  tokenToCookieLocal,
  deleteCookie,
}
