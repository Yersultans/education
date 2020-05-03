import React, { useState, useCallback } from 'react'
import { Button, Form, Icon, Input, Checkbox, Switch, Select } from 'antd'
import { useQuery, useMutation, gql } from '@apollo/client'
import TextEditor from '../../components/nTextEditor'

const GET_QUESTIONS = gql`
  query questions {
    questions {
      id
      text
      level
      correctAnswers
      options
      isMultipleAnswers
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
        activities {
          id
          name
          language
        }
      }
    }
  }
`
const ADD_QUESTION = gql`
  mutation addQuestion($input: QuestionInput) {
    addQuestion(input: $input) {
      id
      text
      level
      options
    }
  }
`
let id = 0

function AddQuestion({ form }) {
  const [formRef, setFormRef] = useState(null)
  const { getFieldDecorator, getFieldValue } = form
  const [text, setText] = useState('')
  const [answers, setAnswers] = useState([])
  const [subjects, setSubjects] = useState(null)
  const [lessons, setLessons] = useState(null)
  const [activities, setActivities] = useState(null)
  const [addQuestion] = useMutation(ADD_QUESTION, {
    update(cache, { data: { addQuestion: question } }) {
      const { questions } = cache.readQuery({ query: GET_QUESTIONS })
      cache.writeQuery({
        query: GET_QUESTIONS,
        data: {
          nquestions: questions.concat([question])
        }
      })
    }
  })
  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

  const { data: dataSubjects, loading, error } = useQuery(GET_SUBJECTS)
  if (loading) return <div> Loading </div>
  if (error) return <div> Error </div>

  const remove = k => {
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  const add = () => {
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const { level, language, subject, lesson, activity } = values
        let newValue = {}
        const { options } = values
        const correctAnswers = answers.map(n => options[n])
        const filterCorrectAnswers = correctAnswers.filter(
          option => option != null
        )

        const filterOption = options.filter(option => option != null)
        newValue = {
          options: filterOption,
          text,
          level,
          correctAnswers: filterCorrectAnswers,
          language,
          subject,
          lesson,
          activity
        }
        addQuestion({
          variables: {
            input: newValue
          }
        })
        setText('')
        form.resetFields()
      }
    })
  }
  const onChange = e => {
    setAnswers(e)
  }

  const handleLanguage = e => {
    const language = e
    const nSubjects = dataSubjects && dataSubjects.subjects
    const filterSubjects = nSubjects.filter(sub => language === sub.language)
    setSubjects(filterSubjects)
  }

  const handleSubject = e => {
    const filterLessons = subjects.find(subject => subject.id === e)
    setLessons(filterLessons.lessons)
  }

  const handleLesson = e => {
    const filterActivities = lessons.find(lesson => lesson.id === e)
    setActivities(filterActivities.activities)
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  }
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
    }
  }
  getFieldDecorator('keys', { initialValue: [] })
  const keys = getFieldValue('keys')
  const formItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? 'Options' : ''}
      required={false}
      key={k}
    >
      {getFieldDecorator(`options[${k}]`, {
        validateTrigger: ['onChange', 'onBlur'],
        rules: [
          {
            required: true,
            whitespace: true,
            message: "Please input passenger's name or delete this field."
          }
        ]
      })(
        <Input placeholder="options" style={{ width: '80%', marginRight: 8 }} />
      )}
      {keys.length > 1 ? (
        <>
          <Checkbox value={k} />
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(k)}
          />
        </>
      ) : null}
    </Form.Item>
  ))
  return (
    <Form onSubmit={handleSubmit} ref={saveFormRef}>
      <Form.Item
        key="Question"
        label="Question"
        {...formItemLayoutWithOutLabel}
      >
        {getFieldDecorator('text', {
          rules: [
            {
              message: `Please give a text to a Question`
            }
          ]
        })(
          <TextEditor
            style={{ width: '60%', marginRight: 8 }}
            initialValue={text}
            onTextChange={e => setText(e)}
          />
        )}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('level', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose level of Question"
            mode="single"
            style={{ width: '60%', marginRight: 8 }}
          >
            <Select.Option key={1} value={1}>
              Easy
            </Select.Option>
            <Select.Option key={2} value={2}>
              Medium
            </Select.Option>
            <Select.Option key={3} value={3}>
              Hard
            </Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('language', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose language of Question"
            mode="single"
            onChange={handleLanguage}
            style={{ width: '60%', marginRight: 8 }}
          >
            <Select.Option key="kazakh" value="kazakh">
              kazakh
            </Select.Option>
            <Select.Option key="russian" value="russian">
              russian
            </Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('subject', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose subject of Question"
            mode="single"
            onChange={handleSubject}
            style={{ width: '60%', marginRight: 8 }}
          >
            {subjects &&
              subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('lesson', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose lesson of Question"
            mode="single"
            onChange={handleLesson}
            style={{ width: '60%', marginRight: 8 }}
          >
            {lessons &&
              lessons.map(lesson => (
                <Select.Option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('activity', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose lesson of Question"
            mode="single"
            style={{ width: '60%', marginRight: 8 }}
          >
            {activities &&
              activities.map(activity => (
                <Select.Option key={activity.id} value={activity.id}>
                  {activity.name}
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <Checkbox.Group onChange={onChange}>{formItems}</Checkbox.Group>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button
          type="dashed"
          onClick={add}
          style={{ width: '60%', marginRight: 8 }}
        >
          <Icon type="plus" /> Add field
        </Button>
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddQuestion)
