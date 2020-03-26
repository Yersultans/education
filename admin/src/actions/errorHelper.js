import { pushError } from './messages'

export default (err, dispatch) => {
  if (err.response) {
    pushError(dispatch, err.response.data.message)
    return
  }
  pushError(dispatch, 'Unspecified error')
}
