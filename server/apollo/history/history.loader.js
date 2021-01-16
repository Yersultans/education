import DataLoader from 'dataloader'
import HistoryModel from './history.model'

async function batchFunction(itemIds) {
  const fields = '_id user questions correctAnswers total updatedAt created_at'
  const items = await HistoryModel.find({ _id: { $in: itemIds } }, fields)
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
