import DataLoader from 'dataloader'
import LessonModel from './lesson.model'

async function batchFunction(itemIds) {
  const fields =
    '_id name content imageUrl language subject videoUrl activities'
  const items = await LessonModel.find({ _id: { $in: itemIds } }, fields)
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
