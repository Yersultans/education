// import React, { useState } from 'react'
// import PropTypes from 'prop-types'
// import styled from 'styled-components'
// import { useMutation, gql } from '@apollo/client'
// import { Button, Form, Input, Checkbox, Switch, Select } from 'antd'
// import TextEditor from '../../components/nTextEditor'

// const { FormItem } = Form

// const UPDATE_QUESTION = gql`
//   mutation updateQuestion($id: ID!, $input: QuestionInput) {
//     updateQuestion(id: $id, input: $input) {
//       id
//       text
//       options
//       type
//       correctAnswers
//       language
//       subject {
//         id
//       }
//       lesson {
//         id
//       }
//     }
//   }
// `
// const EditQuestion = ({ question, subjects, form }) => {
//   const { getFieldDecorator, getFieldValue } = form
//   const [text, setText] = useState(question.text)
//   const [level, setLevel] = useState(question.level)
//   const [answers, setAnswers] = useState(
//     question.options.map(option => question.correctAnswers.includes(option))
//   )
//   const [options, setOptions] = useState(
//     question.options.map((option, k) => {
//       return { option, answer: answers[k] }
//     })
//   )
//   const [language, setLanguage] = useState(question.language)
//   const [lSubjects, setLSubjects] = useState(
//     subjects.filter(sub => sub.language === language)
//   )
//   const [subject, setSubject] = useState(question.subject.id)
//   const [lesson, setLesson] = useState(question.lesson.id)
//   const [lessons, setLessons] = useState(
//     lSubjects.find(({ id }) => id === subject).lessons
//   )
//   const [updateQuestion] = useMutation(UPDATE_QUESTION)

//   const handleLanguage = e => {
//     const filterSubjects = subjects.filter(sub => e === sub.language)
//     setLSubjects(filterSubjects)
//   }

//   const handleSubject = e => {
//     const filterLessons = subjects.find(sub => sub.id === e)
//     setLessons(filterLessons.lessons)
//   }
//   const add = () => {
//     const newOptions = options.concat({ option: '', answer: false })
//     setOptions(newOptions)
//   }
//   const remove = k => {
//     const newOptions = options.filter((option, i) => i !== k)
//     setOptions(newOptions)
//   }
//   const handelUpdateClick = () => {
//     const correctAnswers = options.filter(op => {
//       return op.answer === true
//     })
//     const nOptions = options.map(op => op.option)
//     const nQuestion = {
//       text,
//       level,
//       options: nOptions,
//       language,
//       subject,
//       lesson,
//       correctAnswers: correctAnswers.map(op => op.option)
//     }
//     console.log('nQuestion', nQuestion)
//     // updateQuestion({
//     //   variables: {
//     //     id: question.id,
//     //     input: { nQuestion }
//     //   }
//     // })
//   }
//   const formItems = options.map((option, k) => (
//     <Form.Item>
//       {getFieldDecorator(`options[${k}]`, {
//         validateTrigger: ['onChange', 'onBlur'],
//         rules: [
//           {
//             required: true,
//             whitespace: true,
//             message: "Please input passenger's name or delete this field."
//           }
//         ],
//         initialValue: options[k]
//       })(
//         <Input
//           placeholder="options"
//           style={{ width: '80%', marginRight: 8 }}
//           onChange={e =>
//             setOptions(
//               options.map((op, key) => {
//                 return k === key
//                   ? { option: e.target.value, answer: op.answer }
//                   : op
//               })
//             )
//           }
//         />
//       )}
//       <>
//         <Checkbox
//           checked={options[k].answer}
//           onChange={e =>
//             setOptions(
//               options.map((op, key) => {
//                 return k === key
//                   ? { option: op.option, answer: e.target.checked }
//                   : op
//               })
//             )
//           }
//         />
//         <Icon
//           className="dynamic-delete-button"
//           type="minus-circle-o"
//           onClick={() => remove(k)}
//         />
//       </>
//     </Form.Item>
//   ))
//   return (
//     <Form layout="vertical" onSubmit={handelUpdateClick}>
//       <FormItem>
//         {getFieldDecorator('text', {
//           rules: [
//             {
//               require: false
//             }
//           ],
//           initialValue: text
//         })(<TextEditor initialValue={text} onTextChange={e => setText(e)} />)}
//       </FormItem>
//       <FormItem>
//         {getFieldDecorator('level', {
//           rules: [
//             {
//               required: true
//             }
//           ],
//           initialValue: level
//         })(
//           <Select
//             placeholder="Choose level of Question"
//             mode="single"
//             style={{ width: '60%', marginRight: 8 }}
//             onChange={optionValue => setLevel(optionValue)}
//           >
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
//       </FormItem>
//       <Form.Item>
//         {getFieldDecorator('language', {
//           rules: [
//             {
//               required: true
//             }
//           ],
//           initialValue: language
//         })(
//           <Select
//             placeholder="Choose language of Question"
//             mode="single"
//             onChange={handleLanguage}
//             style={{ width: '60%', marginRight: 8 }}
//           >
//             <Select.Option key="kazakh" value="kazakh">
//               kazakh
//             </Select.Option>
//             <Select.Option key="russian" value="russian">
//               russian
//             </Select.Option>
//           </Select>
//         )}
//       </Form.Item>
//       <Form.Item>
//         {getFieldDecorator('subject', {
//           rules: [
//             {
//               required: true
//             }
//           ],
//           initialValue: subject
//         })(
//           <Select
//             placeholder="Choose subject of Question"
//             mode="single"
//             onChange={handleSubject}
//             style={{ width: '60%', marginRight: 8 }}
//           >
//             {subjects &&
//               subjects.map(sub => (
//                 <Select.Option key={sub.id} value={sub.id}>
//                   {sub.name}
//                 </Select.Option>
//               ))}
//           </Select>
//         )}
//       </Form.Item>
//       <Form.Item>
//         {getFieldDecorator('lesson', {
//           rules: [
//             {
//               required: true
//             }
//           ],
//           initialValue: lesson
//         })(
//           <Select
//             placeholder="Choose lesson of Question"
//             mode="single"
//             style={{ width: '60%', marginRight: 8 }}
//           >
//             {lessons &&
//               lessons.map(less => (
//                 <Select.Option key={less.id} value={less.id}>
//                   {less.name}
//                 </Select.Option>
//               ))}
//           </Select>
//         )}
//       </Form.Item>
//       <Checkbox.Group>{formItems}</Checkbox.Group>
//       <Form.Item>
//         <Button
//           type="dashed"
//           onClick={add}
//           style={{ width: '60%', marginRight: 8 }}
//         >
//           <Icon type="plus" /> Add field
//         </Button>
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   )
// }

// EditQuestion.propTypes = {
//   form: PropTypes.shape({
//     getFieldDecorator: PropTypes.func
//   }).isRequired,
//   subjects: PropTypes.arrayOf({}).isRequired,
//   question: PropTypes.shape({
//     options: PropTypes.arrayOf({}),
//     correctAnswers: PropTypes.arrayOf({})
//   }).isRequired
// }

// export default Form.create()(EditQuestion)
