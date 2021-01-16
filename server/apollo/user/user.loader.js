import DataLoader from 'dataloader'
import UsertModel from './user.model'

async function batchFunction(itemIds) {
  const fields =
    '_id username firstName lastName name parentEmail birthDate role imageUrl'
  const items = await UsertModel.find({ _id: { $in: itemIds } }, fields)
  const results = itemIds.map(itemId => {
    const singleItem = items.find(
      item => item._id.toString() === itemId.toString()
    )
    return singleItem
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
