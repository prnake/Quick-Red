const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      // for dev, I set token as 123456,
      // in real practice, I need to know the token existed or not
      const token = 123456

      // mock error
      if (!token) {
        return {
          code: 400,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 200,
        data: token
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  // user register
  {
    url: '/user/register',
    type: 'post',
    response: config => {
      // for dev, I set token as 123456
      // in real pratice, i need to know whether this username is used or not
      const token = {
        token: 123456
      }
      // mock error
      if (!token) {
        return {
          code: 201,
          message: 'This username is not valid.'
        }
      }

      return {
        code: 200,
        data: token
      }
    }
  }
]
