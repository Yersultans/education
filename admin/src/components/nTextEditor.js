import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line import/first
import ReactQuill from 'react-quill'

require('react-quill/dist/quill.snow.css')

const modules = {
  syntax: true,
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code', 'code-block'],
    [{ script: 'sub' }, { script: 'super' }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image'],
    ['clean']
  ]
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code',
  'code-block',
  'script',
  'list',
  'bullet',
  'indent',
  'link',
  'image'
]

const TextEditor = ({ onTextChange, initialValue }) => (
  <ReactQuill
    defaultValue={initialValue}
    theme="snow"
    onChange={onTextChange}
    modules={modules}
    formats={formats}
    style={{ backgroundColor: '#FFF' }}
  />
)

TextEditor.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired
}

export default TextEditor
