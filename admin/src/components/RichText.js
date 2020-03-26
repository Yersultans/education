import React from 'react'
import PropTypes from 'prop-types'
import EditorJs from 'react-editor-js'
import Code from '@editorjs/code'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import { Button } from 'antd'

class RichText extends React.Component {
  handleCustomSave = async () => {
    const savedData = await this.ref.save()
    this.props.onTextChange(savedData.blocks)
  }

  saveInstance = ref => {
    this.ref = ref
  }

  render() {
    return (
      <>
        <EditorJs
          holder="editorjs"
          placeholder="Custom Let`s write an awesome story!"
          autofocus
          instanceRef={this.saveInstance}
          minHeight={80}
          data={{
            blocks: this.props.blocks
          }}
          tools={{
            header: Header,
            list: List,
            code: Code,
            quote: Quote,
            embed: Embed,
            inlineCode: InlineCode,
            image: {
              class: Image,
              config: {
                endpoints: {
                  byUrl: '/api/nActivity/uploadImageByUrl'
                }
              }
            }
          }}
        >
          <div id="editorjs" />
        </EditorJs>
        <Button onClick={this.handleCustomSave}>Save editor</Button>
      </>
    )
  }
}

RichText.propTypes = {
  onTextChange: PropTypes.func.isRequired,
  blocks: PropTypes.shape({})
}

RichText.defaultProps = {
  blocks: null
}

export default RichText
