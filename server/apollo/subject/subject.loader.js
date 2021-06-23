import DataLoader from 'dataloader'
import SubjectModel from './subject.model'

async function batchFunction(itemIds) {
  const fields = '_id name imageUrl language description price lessons'
  const items = await SubjectModel.find({ _id: { $in: itemIds } }, fields)
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
