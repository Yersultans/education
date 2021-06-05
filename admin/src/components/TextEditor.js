import React from 'react'
// eslint-disable-next-line import/first
import ReactQuill from 'react-quill'
// eslint-disable-next-line import/first
import PropTypes from 'prop-types'

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

// const convertValue = text => {
//   const newText = text.replace("<", "&lt;").replace(">", "&gt;");
//   console.log("newText", newText);
//   return newText;
// };

// const convertImg = () => {
//   const newText = text.replace("&lt;", "<").replace("&gt;", ">");
//   console.log("newText", newText);
// };

const TextEditor = ({ value, onTextChange }) => (
  <ReactQuill
    value={value}
    theme="snow"
    onChange={onTextChange}
    modules={modules}
    formats={formats}
  />
)

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired
}

export default TextEditor
