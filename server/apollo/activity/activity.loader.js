import DataLoader from 'dataloader'
import ActivityModel from './activity.modal'

async function batchFunction(activityIds) {
  const fields = '_id name content imageUrl language subject lesson videoUrl'
  const activities = await ActivityModel.find(
    { _id: { $in: activityIds } },
    fields
  )
  const results = activityIds.map(activityId => {
    const singleActivity = activities.find(
      activity => activity._id.toString() === activityId.toString()
    )
    return singleActivity
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
