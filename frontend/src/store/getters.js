const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  hasAuth: state => state.user.hasAuth,
  hasLogin: state => state.user.hasLogin,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  noticenum: state => state.user.noticenum,
  notices: state => state.user.notices,
  nickname: state => state.user.nickname,
  authurl: state => state.user.authurl,
  details: state => state.user.details
}
export default getters
