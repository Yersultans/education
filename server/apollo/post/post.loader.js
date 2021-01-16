import DataLoader from 'dataloader'
import PostModel from './post.model'

async function batchFunction(itemIds) {
  const fields = '_id name content imageUrl user messages updatedAt created_at'
  const items = await PostModel.find({ _id: { $in: itemIds } }, fields)
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
