import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DatePicker, Modal, Form, Input, Select, Checkbox } from 'antd'

import StyledTooltip from './StyledTooltip'

const { TextArea } = Input
const FormItem = Form.Item

const DetailsIcon = styled.img`
  width: 32px;
  height: 32px;
`

const CreateForm = ({ visible, onCancel, onCreate, fields, title }) => {
  const [form] = Form.useForm()

  const getTooltip = (text, fullText) => {
    return <StyledTooltip {...{ text, fullText }} />
  }

  return (
    <Modal
      visible={visible}
      title={title}
      okText="Создать"
      cancelText="Закрыть"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()

            // if (image) {
            //   delete values.imageURL
            //   axios.post('/api/uploadImageByFile', image, {}).then(res => {
            //     if (res.data && res.data.file) {
            //       onCreate({ ...values, imageURL: res.data.file.url })
            //     }
            //   })
            // } else {
            onCreate(values)
            // }
          })
          .catch(info => {
            // eslint-disable-next-line no-console
            console.log('Validate Failed:', info)
          })
      }}
    >
      <>
        <Form form={form} layout="vertical">
          {fields.map(field => (
            <FormItem
              key={field.label}
              label={
                field.tooltipText
                  ? getTooltip(field.label, field?.tooltipText)
                  : field.label
              }
              name={field.key}
              rules={[
                {
                  required: !field.isNotRequired,
                  message: `Please give a name to a ${field.label}`
                }
              ]}
            >
              {/* eslint-disable */
              field.options ? (
                <Select
                  mode={field.mode || 'single'}
                  placeholder="Choose type"
                  showSearch
                >
                  {field.options.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.labelImg && <DetailsIcon src={option.labelImg} />}
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              ) : field.checkbox ? (
                <Checkbox />
              ) : field.number ? (
                <Input type="number" placeholder={0} />
              ) : field.inputType === 'date' ? (
                <DatePicker showTime />
              ) : field.image ? (
                <input
                  type="file"
                  name="image"
                  onChange={event => {
                    if (event.target.files[0]) {
                      const data = new FormData()
                      data.append('image', event.target.files[0])
                      setImage(data)
                    }
                  }}
                />
              ) : field.textArea ? (
                <TextArea row={4} />
              ) : (
                <Input placeholder={field.label} />
              )
              /* eslint-enable */
              }
            </FormItem>
          ))}
        </Form>
      </>
    </Modal>
  )
}

CreateForm.propTypes = {
  dataToDisplay: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

CreateForm.defaultProps = {
  dataToDisplay: {}
}

export default CreateForm
