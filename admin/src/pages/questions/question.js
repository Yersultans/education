import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Form, Icon, Input, Checkbox, Switch, Select } from 'antd'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import TextEditor from '../../components/nTextEditor'

const GET_DATA = gql`
  query question($id: ID!) {
    question(id: $id) {
      text
      level
      options
      correctAnswers
    }
  }
`
const UPDATE_QUESTION = gql`
  mutation updateQuestion($id: ID!, $input: QuestionInput) {
    updateQuestion(id: $id, input: $input) {
      text
      level
      correctAnswers
      options
      isMultipleAnswers
    }
  }
`
const ids = 0

function EditQuestion(props) {
  const { id } = props.match.params
  const { data, loading, error } = useQuery(GET_DATA, { variables: { id } })
  const [formRef, setFormRef] = useState(null)
  const { getFieldDecorator, getFieldValue } = props.form
  const [answers, setAnswers] = useState([])
  const [isMultipleAnswers, setIsMultipleAnswers] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [updateQuestion] = useMutation(UPDATE_QUESTION)
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (!loading && options !== data.question.options) {
      setOptions(data.question.options)
    }
  })

  const remove = k => {
    const keys = props.form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    setOptions(keys.filter(key => key !== k))
    props.form.setFieldsValue({
      options: keys.filter(key => key !== k),
      keys: keys.filter(key => key !== k)
    })
  }

  const add = () => {
    const keys = props.form.getFieldValue('keys')
    // const options = props.form.getFieldValue('keys')
    const nextKeys = keys.concat('')
    props.form.setFieldsValue({
      options: nextKeys,
      keys: nextKeys
    })
    setOptions(nextKeys)
  }

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values: ', values)
        const { text, type, level } = values
        let newValue = {}

        const { options, keys } = values
        const correctAnswers = answers.map(n => n)
        newValue = {
          options,
          text,
          level,
          type,
          correctAnswers,
          isMultipleAnswers
        }

        updateQuestion({ variables: { id, input: newValue } })
      }
    })
  }
  const onChange = e => {
    console.log(e)
    setAnswers(e, data.question.correctAnswers)
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
  getFieldDecorator('keys', { initialValue: options })
  const keys = getFieldValue('keys')
  // const optionsCheck = getFieldValue('options')
  const formItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? 'Options' : ''}
      required={false}
      key={index}
    >
      {getFieldDecorator(`options[${index}]`, {
        validateTrigger: ['onChange', 'onBlur'],
        initialValue: loading ? [] : options[index],
        rules: [
          {
            required: true,
            whitespace: true,
            message: 'Please input this field.'
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

  if (loading) return <div> Loading </div>
  if (error) return <div> Error </div>
  return (
    <Form onSubmit={handleSubmit} ref={saveFormRef}>
      <Form.Item
        key="Question"
        label="Question"
        {...formItemLayoutWithOutLabel}
      >
        {getFieldDecorator('text', {
          initialValue: `${data && data.question ? data.question.text : ''}`,
          rules: [
            {
              required: true,
              message: `Please give a name to a Question`
            }
          ]
        })(<Input style={{ width: '60%', marginRight: 8 }} />)}
      </Form.Item>

      <Form.Item key="Level" label="Level" {...formItemLayoutWithOutLabel}>
        {getFieldDecorator('level', {
          initialValue: data && data.question && data.question.level,
          rules: [
            {
              required: true,
              message: `Please give a name to a Question`
            }
          ]
        })(
          <Select placeholder="Please select a Level" style={{ width: '100%' }}>
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

      {options.length > 1 ? (
        <>
          <Checkbox.Group
            defaultValue={loading ? [] : data.question.correctAnswers}
            onChange={onChange}
            style={{ display: optionsVisible ? 'block' : 'block' }}
          >
            {formItems}
          </Checkbox.Group>
          <Form.Item
            {...formItemLayoutWithOutLabel}
            style={{ display: optionsVisible ? 'block' : 'block' }}
          >
            <Button
              type="dashed"
              onClick={add}
              style={{ width: '60%', marginRight: 8 }}
            >
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
        </>
      ) : null}

      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(EditQuestion)
