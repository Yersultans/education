import DataLoader from 'dataloader'
import ActivityModel from './activity.modal'

async function batchFunction(activityIds) {
  const activities = await ActivityModel.find({ _id: { $in: activityIds } })
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
