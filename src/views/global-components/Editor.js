import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import Mousetrap from 'mousetrap';

class Editor extends React.Component {
  componentDidMount() {
    console.log('mount');
    autosize(document.querySelector('.editor-ctrl'));
  }
  render() {
    return (
      <div className="editor">
        <textarea
          ref={this.props.inputRef}
          className="editor-ctrl mousetrap"
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder="What's on your mind?"
        />
      </div>
    );
  }
}

Editor.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Editor.defaultProps = {
  value: '',
};

module.exports = Editor;
