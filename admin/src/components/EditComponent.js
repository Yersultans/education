import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, Checkbox, DatePicker, Switch } from 'antd'
import TextEditor from '../components/nTextEditor'

const FormItem = Form.Item
const { Option } = Select

class EditComponent extends PureComponent {
  handleInputChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleUpdate = event => {
    event.preventDefault()
    this.props.onUpdateClick(this.state)
  }

  renderElements = ({
    key,
    label,
    type,
    options,
    isMultipleSelection,
    value,
    checkedChildren,
    unCheckedChildren,
    dateString
  }) => {
    switch (type) {
      case 'select':
        return (
          <Select
            labelInValue={isMultipleSelection}
            mode={isMultipleSelection ? 'multiple' : 'single'}
            placeholder={`Please select a ${label}`}
            style={{ width: '100%' }}
            onChange={optionValue => {
              if (isMultipleSelection) {
                const selectedOptions = optionValue.map(option => option.key)
                this.setState({ [key]: selectedOptions })
              } else this.setState({ [key]: optionValue })
            }}
          >
            {options.map(lesson => (
              <Option key={lesson.value} value={lesson.value}>
                {lesson.label}
              </Option>
            ))}
          </Select>
        )
      case 'checkbox':
        return (
          <Checkbox
            defaultChecked={value}
            onChange={e => this.handleInputChange(key, !e.target.value)}
          >
            {label}
          </Checkbox>
        )
      case 'text':
        return (
          <TextEditor
            initialValue={value}
            onTextChange={element => this.handleInputChange(key, element)}
          />
        )
      case 'switch':
        return (
          <Switch
            checkedChildren={checkedChildren}
            unCheckedChildren={unCheckedChildren}
            defaultChecked={value}
            onChange={e => this.handleInputChange(key, e)}
          />
        )
      case 'datePicker':
        return (
          <>
            <DatePicker
              onChange={(_, date) => this.handleInputChange(key, date)}
            />
            <p>{dateString}</p>
          </>
        )
      case 'password':
        return (
          <>
            <Input
              onChange={e => this.handleInputChange(key, e.target.value)}
            />
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </>
        )
      default:
        return (
          <Input
            placeholder={label}
            onChange={e => this.handleInputChange(key, e.target.value)}
          />
        )
    }
  }

  render() {
    const { fields, form } = this.props
    const { getFieldDecorator } = form
    console.log('fields are', fields)

    return (
      <Form layout="vertical" onSubmit={this.handleUpdate}>
        {fields.map(field => {
          const {
            label,
            key,
            value,
            isRequired,
            type,
            isMultipleSelection
          } = field
          return (
            <FormItem key={key} label={label}>
              {getFieldDecorator(key, {
                rules: [
                  {
                    required: isRequired,
                    message: `Please give a name to a ${label}`
                  }
                ],
                initialValue:
                  type === 'select' && value && isMultipleSelection
                    ? value.map(option => ({
                        key: option._id,
                        label: option.name
                      }))
                    : value
              })(this.renderElements(field))}
            </FormItem>
          )
        })}
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    )
  }
}

EditComponent.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onUpdateClick: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func
  }).isRequired
}

export default Form.create()(EditComponent)
