import React, { useState, useCallback } from 'react'
import { Button, Form, Icon, Input, Checkbox, Switch, Select } from 'antd'
import { useQuery, useMutation, gql, useLazyQuery } from '@apollo/client'
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
// const GET_SUBJECTS = gql`
//   query getSubjects {
//     subjects {
//       id
//       name
//       language
//       lessons {
//         id
//         name
//         language
//         activities {
//           id
//           name
//           language
//         }
//       }
//     }
//   }
// `
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

const GET_SUBJECTS = gql`
  query getSubjectsByLanguage($input: FilterSubjectInput) {
    subjectsBy(input: $input) {
      id
      name
      language
    }
  }
`

const GET_LESSONS = gql`
  query getLessons($id: ID!) {
    subject(id: $id) {
      id
      lessons {
        id
        name
        language
      }
    }
  }
`

const GET_ACTIVITIES = gql`
  query getActivities($id: ID!) {
    lesson(id: $id) {
      id
      activities {
        id
        name
        language
      }
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

  const [
    getSubjects,
    { data: dataSubjects, loading: loadingSubjects, error: errorSubjects }
  ] = useLazyQuery(GET_SUBJECTS)

  const [
    getLessons,
    { data: dataLessons, loading: loadingLessons, error: errorLessons }
  ] = useLazyQuery(GET_LESSONS)

  const [
    getActivities,
    { data: dataActivities, loading: loadingActivities, error: errorActivities }
  ] = useLazyQuery(GET_ACTIVITIES)

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

  React.useEffect(() => {
    if (
      dataSubjects &&
      dataSubjects.subjectsBy &&
      !loadingSubjects &&
      !errorSubjects
    ) {
      setSubjects(dataSubjects.subjectsBy)
    }
  }, [dataSubjects, loadingSubjects, errorSubjects])

  React.useEffect(() => {
    if (
      dataLessons &&
      dataLessons.subject &&
      dataLessons.subject.lessons &&
      !loadingLessons &&
      !errorLessons
    ) {
      setLessons(dataLessons.subject.lessons)
    }
  }, [dataLessons, loadingLessons, errorLessons])

  React.useEffect(() => {
    if (
      dataActivities &&
      dataActivities.lesson &&
      dataActivities.lesson.activities &&
      !loadingActivities &&
      !errorActivities
    ) {
      setActivities(dataActivities.lesson.activities)
    }
  }, [dataActivities, loadingActivities, errorActivities])

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
    getSubjects({ variables: { input: { language: e } } })
  }

  const handleSubject = e => {
    getLessons({ variables: { id: e } })
  }

  const handleLesson = e => {
    getActivities({ variables: { id: e } })
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
            message: 'Please enter the response option or delete this field.'
          }
        ]
      })(
        <Input
          placeholder="Варианты"
          style={{ width: '80%', marginRight: 8 }}
        />
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
      <Form.Item key="Question" label="Вопрос" {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('text', {
          rules: [
            {
              message: `Пожалуйста, дайте текст вопроса`
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
            placeholder="Выберите уровень вопроса"
            mode="single"
            style={{ width: '60%', marginRight: 8 }}
          >
            <Select.Option key={1} value={1}>
              Легко
            </Select.Option>
            <Select.Option key={2} value={2}>
              Средний
            </Select.Option>
            <Select.Option key={3} value={3}>
              Трудный
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
            placeholder="Выберите язык вопроса"
            mode="single"
            onChange={handleLanguage}
            style={{ width: '60%', marginRight: 8 }}
          >
            <Select.Option key="kazakh" value="kazakh">
              Казахский
            </Select.Option>
            <Select.Option key="russian" value="russian">
              Русский
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
            placeholder="Выберите Пердмет вопроса"
            mode="single"
            onChange={handleSubject}
            style={{ width: '60%', marginRight: 8 }}
            disabled={!subjects}
            loading={loadingSubjects}
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
            placeholder="Выберите Урок вопроса"
            mode="single"
            onChange={handleLesson}
            style={{ width: '60%', marginRight: 8 }}
            disabled={!lessons}
            loading={loadingLessons}
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
            placeholder="Выберите Раздел вопроса"
            mode="single"
            style={{ width: '60%', marginRight: 8 }}
            disabled={!activities}
            loading={loadingActivities}
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
          <Icon type="plus" /> Добавить Варианты
        </Button>
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="primary" htmlType="submit">
          Отправить
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddQuestion)
