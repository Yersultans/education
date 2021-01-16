import DataLoader from 'dataloader'
import ProgressModel from './progress.model'

async function batchFunction(itemIds) {
  const fields =
    '_id user question subject lesson userAnswers isCorrect created_at updateAt'
  const items = await ProgressModel.find({ _id: { $in: itemIds } }, fields)
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
