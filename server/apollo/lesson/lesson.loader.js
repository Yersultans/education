import DataLoader from 'dataloader'
import LessonModel from './lesson.model'

async function batchFunction(itemIds) {
  const items = await LessonModel.find({ _id: { $in: itemIds } })
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
