const Airtable = require('airtable')

// const isDevMode = process.env.NODE_ENV !== "production";

const ReqCodeTableName = 'Session_Registrations'
const SUBMISSIONTABLENAME = 'API_Project_Submissions'
let base = null
let rowId = null
let rowData = {}
const airTable = {
  init: () => {
    if (!base) {
      const AIRTABLE_API_KEY = 'key9zpFqBLvHoLJmx'
      Airtable.configure({ apiKey: AIRTABLE_API_KEY })
      base = Airtable.base('appeW0CQIT8XAtObf')
    }
  },

  findRow: async username => {
    const today = new Date()
    const day = today.getDate()
    // const day = 27;
    const month = today.getMonth()
    const year = today.getFullYear()
    const fullDate = `${year}-${month > 9 ? month : `0${month}`}-${
      day > 9 ? day : `0${day}`
    }`
    const formula = `{Username} = "${username}"`
    // const formula = `{Username} = 'elliotlee'`;
    await new Promise(res =>
      base(ReqCodeTableName)
        .select({
          view: 'Grid view',
          fields: ['RegCode', 'Reg#', 'Project'],
          filterByFormula: formula
        })
        .eachPage(
          async (records, fetchNextPage) => {
            const record = records.find(
              row => row.fields.RegCode.indexOf(fullDate) !== -1
            )
            if (record) {
              rowId = record.id
              console.log('rowId', rowId)
              rowData = {
                ...rowData,
                Code: record.fields['Reg#'].toString(),
                'Session RegCode [API]': record.fields.RegCode
              }
              res(rowId)
            }
            if (!rowId) await fetchNextPage()
          },
          err => {
            if (err) {
              console.error(err)
              res(null)
            }
            res(null)
          }
        )
    )
  },
  updateTable: async data => {
    // type: "LinkSubmit"
    base(SUBMISSIONTABLENAME).create(
      {
        ...rowData,
        ...data
      },
      err => {
        if (err) {
          console.error(err)
          return null
        }
        return null
      }
    )
    console.log('updated')
    return null
  }
}

module.exports = {
  airTable
}
