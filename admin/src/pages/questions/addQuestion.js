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
  const [answers, setAnswers] = useState([])
  const [isMultipleAnswers, setIsMultipleAnswers] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)
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
        const { text, type, level } = values
        let newValue = {}
        if (type === 'MultipleChoice') {
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
            type,
            correctAnswers: filterCorrectAnswers,
            isMultipleAnswers
          }
        } else if (type === 'OpenEnded') {
          newValue = {
            text,
            level,
            type
          }
        }
        addQuestion({
          variables: {
            input: newValue
          }
        })
        console.log('newValue', newValue)

        form.resetFields()
      }
    })
  }
  const onChange = e => {
    setAnswers(e)
  }
  const onChangeMultiple = e => {
    setIsMultipleAnswers(e)
  }

  const handleQuestionType = e => {
    if (e === 'MultipleChoice') setOptionsVisible(true)
    else setOptionsVisible(false)
  }

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node)
    }
  }, [])

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
        <Input placeholder="options" style={{ width: '60%', marginRight: 8 }} />
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
              required: true,
              message: `Please give a text to a Question`
            }
          ]
        })(<Input style={{ width: '60%', marginRight: 8 }} />)}
      </Form.Item>
      <Form.Item
        key="Multiple Answers"
        label="Multiple Answers"
        {...formItemLayoutWithOutLabel}
      >
        {getFieldDecorator('isMultipleAnswers', {
          rules: [
            {
              required: false
            }
          ]
        })(
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            onChange={onChangeMultiple}
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
        {getFieldDecorator('type', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            placeholder="Choose type of Question"
            mode="single"
            onChange={handleQuestionType}
            style={{ width: '60%', marginRight: 8 }}
          >
            <Select.Option key="MultipleChoice" value="MultipleChoice">
              MultipleChoice
            </Select.Option>
            <Select.Option key="OpenEnded" value="OpenEnded">
              OpenEnded
            </Select.Option>
          </Select>
        )}
      </Form.Item>

      <Checkbox.Group
        onChange={onChange}
        style={{ display: optionsVisible ? 'block' : 'none' }}
      >
        {formItems}
      </Checkbox.Group>
      <Form.Item
        {...formItemLayoutWithOutLabel}
        style={{ display: optionsVisible ? 'block' : 'none' }}
      >
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
