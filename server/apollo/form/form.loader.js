import DataLoader from 'dataloader'
import FormModel from './form.model'

async function batchFunction(formIds) {
  const fields = '_id name description user messages created_at  updatedAt'
  const forms = await FormModel.find({ _id: { $in: formIds } }, fields)
  const results = formIds.map(fromId => {
    const singleForm = forms.find(
      form => form._id.toString() === fromId.toString()
    )
    return singleForm
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
