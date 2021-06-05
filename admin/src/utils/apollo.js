export const removeTypenameField = obj => {
  const newObj = {}
  if (!obj) {
    return obj
  }
  if (typeof obj !== 'object') {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(elem => removeTypenameField(elem))
  }
  Object.keys(obj).forEach(key => {
    if (key !== '__typename' && key !== 'id') {
      newObj[key] = removeTypenameField(obj[key])
    }
  })
  return newObj
}

export const removeAnnoyingHeader = errorString => {
  const pieces = errorString.split(':')
  return pieces[pieces.length - 1]
}
