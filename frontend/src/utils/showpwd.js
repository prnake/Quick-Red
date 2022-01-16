export function showpwd(ptr) {
  if (ptr.inputType === 'hide') {
    ptr.inputType = 'show'
  } else {
    ptr.inputType = 'hide'
  }
  ptr.$nextTick(() => {
    ptr.$refs.password.focus()
  })
}
