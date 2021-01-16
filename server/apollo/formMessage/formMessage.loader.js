import DataLoader from 'dataloader'
import FormMessageModel from './formMessage.model'

async function batchFunction(itemIds) {
  const fields = '_id content user messages post form updatedAt created_at'
  const items = await FormMessageModel.find({ _id: { $in: itemIds } }, fields)
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
