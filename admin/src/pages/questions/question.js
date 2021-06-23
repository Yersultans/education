import React from 'react'
import { Spin } from 'antd'
import { useQuery, gql } from '@apollo/client'
import EditQuestion from './editQuestion'

const GET_DATA = gql`
  query question($id: ID!) {
    question(id: $id) {
      id
      text
      level
      options
      correctAnswers
      language
      subject {
        id
      }
      lesson {
        id
      }
    }
  }
`
const GET_SUBJECTS = gql`
  query getSubjects {
    subjects {
      id
      name
      language
      lessons {
        id
        name
        language
      }
    }
  }
`
export default function Question(props) {
  const { id } = props.match.params
  const { data, loading, error } = useQuery(GET_DATA, { variables: { id } })
  const { data: subjectsData, subjectsLoading, subjectsError } = useQuery(
    GET_SUBJECTS
  )

  if (loading || subjectsLoading)
    return (
      <div>
        <Spin />
      </div>
    )

  if (error || subjectsError) return <div>ERROR</div>
  return (
    <>
      {data && subjectsData && (
        <EditQuestion
          question={data.question}
          subjects={subjectsData.subjects}
        />
      )}
    </>
  )
}

// const ids = 0

// function EditQuestion(props) {
//   const { id } = props.match.params
//   const { data, loading, error } = useQuery(GET_DATA, { variables: { id } })
//   const [formRef, setFormRef] = useState(null)
//   const { getFieldDecorator, getFieldValue } = props.form
//   const [answers, setAnswers] = useState([])
//   const [updateQuestion] = useMutation(UPDATE_QUESTION)
//   const [options, setOptions] = useState([])

//   const { data: dataSubjects, loadingSubjects, errorSubjects } = useQuery(
//     GET_SUBJECTS
//   )

//   const [subjects, setSubjects] = useState(
//     dataSubjects && dataSubjects.subjects
//       ? dataSubjects.subjects.filter(
//           subject => subject.language === data.question.language
//         )
//       : null
//   )
//   const [lessons, setLessons] = useState(
//     dataSubjects && dataSubjects.subjects
//       ? dataSubjects.subjects.find(
//           subject => subject.id === data.question.subject.id
//         )
//       : null
//   )

//   useEffect(() => {
//     if (!loading && options !== data.question.options) {
//       setOptions(data.question.options)
//     }
//   })

//   const remove = k => {
//     const keys = props.form.getFieldValue('keys')
//     if (keys.length === 1) {
//       return
//     }
//     setOptions(keys.filter(key => key !== k))
//     props.form.setFieldsValue({
//       options: keys.filter(key => key !== k),
//       keys: keys.filter(key => key !== k)
//     })
//   }

//   const add = () => {
//     const keys = props.form.getFieldValue('keys')
//     // const options = props.form.getFieldValue('keys')
//     const nextKeys = keys.concat('')
//     props.form.setFieldsValue({
//       options: nextKeys,
//       keys: nextKeys
//     })
//     setOptions(nextKeys)
//   }

//   const handleSubmit = e => {
//     e.preventDefault()
//     props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('values: ', values)
//         const { text, level } = values
//         let newValue = {}

//         const { options, keys } = values
//         const correctAnswers = answers.map(n => n)
//         newValue = {
//           options,
//           text,
//           level,
//           correctAnswers
//         }

//         updateQuestion({ variables: { id, input: newValue } })
//       }
//     })
//   }
//   const onChange = e => {
//     console.log(e)
//     setAnswers(e, data.question.correctAnswers)
//   }

//   const handleLanguage = e => {
//     const filterSubjects =
//       dataSubjects &&
//       dataSubjects.subjects &&
//       dataSubjects.subjects.filter(subject => subject.language === e)
//     setSubjects(filterSubjects)
//   }

//   const handleSubject = e => {
//     const filterLessons = subjects.find(subject => subject.id === e)
//     setLessons(filterLessons)
//   }

//   const saveFormRef = useCallback(node => {
//     if (node !== null) {
//       setFormRef(node)
//     }
//   }, [])

//   const formItemLayout = {
//     labelCol: {
//       xs: { span: 24 },
//       sm: { span: 4 }
//     },
//     wrapperCol: {
//       xs: { span: 24 },
//       sm: { span: 20 }
//     }
//   }
//   const formItemLayoutWithOutLabel = {
//     wrapperCol: {
//       xs: { span: 24, offset: 0 },
//       sm: { span: 20, offset: 4 }
//     }
//   }
//   getFieldDecorator('keys', { initialValue: options })
//   const keys = getFieldValue('keys')
//   // const optionsCheck = getFieldValue('options')
//   const formItems = keys.map((k, index) => (
//     <Form.Item
//       {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
//       label={index === 0 ? 'Options' : ''}
//       required={false}
//       key={index}
//     >
//       {getFieldDecorator(`options[${index}]`, {
//         validateTrigger: ['onChange', 'onBlur'],
//         initialValue: loading ? [] : options[index],
//         rules: [
//           {
//             required: true,
//             whitespace: true,
//             message: 'Please input this field.'
//           }
//         ]
//       })(
//         <Input placeholder="options" style={{ width: '60%', marginRight: 8 }} />
//       )}
//       {keys.length > 1 ? (
//         <>
//           <Checkbox value={k} />
//           <Icon
//             className="dynamic-delete-button"
//             type="minus-circle-o"
//             onClick={() => remove(k)}
//           />
//         </>
//       ) : null}
//     </Form.Item>
//   ))

//   if (loading || loadingSubjects) return <div> Loading </div>
//   if (error || errorSubjects) return <div> Error </div>
//   return (
//     <Form onSubmit={handleSubmit} ref={saveFormRef}>
//       <Form.Item
//         key="Question"
//         label="Question"
//         {...formItemLayoutWithOutLabel}
//       >
//         {getFieldDecorator('text', {
//           initialValue: `${data && data.question ? data.question.text : ''}`,
//           rules: [
//             {
//               required: true,
//               message: `Please give a name to a Question`
//             }
//           ]
//         })(<Input style={{ width: '60%', marginRight: 8 }} />)}
//       </Form.Item>

//       <Form.Item key="Level" label="Level" {...formItemLayoutWithOutLabel}>
//         {getFieldDecorator('level', {
//           initialValue: data && data.question && data.question.level,
//           rules: [
//             {
//               required: true,
//               message: `Please give a name to a Question`
//             }
//           ]
//         })(
//           <Select placeholder="Please select a Level" style={{ width: '100%' }}>
//             <Select.Option key={1} value={1}>
//               Easy
//             </Select.Option>
//             <Select.Option key={2} value={2}>
//               Medium
//             </Select.Option>
//             <Select.Option key={3} value={3}>
//               Hard
//             </Select.Option>
//           </Select>
//         )}
//       </Form.Item>

//       <Form.Item
//         key="Language"
//         label="Language"
//         {...formItemLayoutWithOutLabel}
//       >
//         {getFieldDecorator('language', {
//           initialValue: data && data.question && data.question.language,
//           rules: [
//             {
//               required: true,
//               message: `Please give a language to a Question`
//             }
//           ]
//         })(
//           <Select
//             placeholder="Please select a Language"
//             style={{ width: '100%' }}
//             onChange={handleLanguage}
//           >
//             <Select.Option key="kazakh" value="kazakh">
//               kazakh
//             </Select.Option>
//             <Select.Option key="rassian" value="rassian">
//               rassian
//             </Select.Option>
//           </Select>
//         )}
//       </Form.Item>

//       <Form.Item key="Subject" label="Subject" {...formItemLayoutWithOutLabel}>
//         {getFieldDecorator('subject', {
//           initialValue: data && data.question && data.question.subject.id,
//           rules: [
//             {
//               required: true,
//               message: `Please give a subject to a Question`
//             }
//           ]
//         })(
//           <Select
//             placeholder="Please select a Subject"
//             style={{ width: '100%' }}
//             onChange={handleSubject}
//           >
//             {subjects &&
//               subjects.map(subject => (
//                 <Select.Option key={subject.id} value={subject.id}>
//                   {subject.name}
//                 </Select.Option>
//               ))}
//           </Select>
//         )}
//       </Form.Item>

//       <Form.Item key="Lesson" label="Lesson" {...formItemLayoutWithOutLabel}>
//         {getFieldDecorator('lesson', {
//           initialValue: data && data.question && data.question.lesson.id,
//           rules: [
//             {
//               required: true,
//               message: `Please give a lesson to a Question`
//             }
//           ]
//         })(
//           <Select
//             placeholder="Please select a Lesson"
//             style={{ width: '100%' }}
//           >
//             {lessons &&
//               lessons.map(lesson => (
//                 <Select.Option key={lesson.id} value={lesson.id}>
//                   {lesson.name}
//                 </Select.Option>
//               ))}
//           </Select>
//         )}
//       </Form.Item>
//       <>
//         <Checkbox.Group
//           defaultValue={loading ? [] : data.question.correctAnswers}
//           onChange={onChange}
//         >
//           {formItems}
//         </Checkbox.Group>
//         <Form.Item {...formItemLayoutWithOutLabel}>
//           <Button
//             type="dashed"
//             onClick={add}
//             style={{ width: '60%', marginRight: 8 }}
//           >
//             <Icon type="plus" /> Add field
//           </Button>
//         </Form.Item>
//       </>

//       <Form.Item {...formItemLayoutWithOutLabel}>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   )
// }

// export default Form.create()(EditQuestion)
