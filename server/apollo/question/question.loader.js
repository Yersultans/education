import DataLoader from 'dataloader'
import QuestionModel from './question.model'

async function batchFunction(itemIds) {
  const fields =
    '_id text options level correctAnswers language question correctAnswerImg correctAnswerVideo subject lesson activity'
  const items = await QuestionModel.find({ _id: { $in: itemIds } }, fields)
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
