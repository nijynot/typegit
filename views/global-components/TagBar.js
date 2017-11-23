import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Modal from 'react-modal';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const style = {
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  content: {
    position: 'relative',
  },
};

class TagBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      value: '',
    };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getValue = this.getValue.bind(this);
    // this.openModal = this.openModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
  }
  // openModal() {
  //   this.setState({ modalIsOpen: true });
  // }
  // closeModal() {
  //   this.setState({ modalIsOpen: false });
  // }
  onKeyDown(e) {
    // console.log(this.getValue());
    const prevent = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    const addKeyDown = (e.keyCode === 32 || e.keyCode === 13);
    const userTags = this.props.me.tags.map(tag => tag.label);
    const inputValue = this.getValue();

    if (addKeyDown && !isEmpty(intersection([inputValue], userTags))) {
      // if keydown and tag does exists
      this.props.onAddTag(this.getValue());
      this.setState({ value: '' });
      prevent(e);
    } else if (addKeyDown) {
      // if keydown and tag does not exists
      prevent(e);
    } else if (e.keyCode === 8 && this.input.value === '') {
      // If backspace is pressed to delete latest tag
      this.props.onRemoveTag(this.props.tags.length - 1);
    }
  }
  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  }
  getValue() {
    return get(this.state.value.match(/([a-zA-Z0-9-])+/g), '[0]', null);
  }
  render() {
    return (
      <div
        className="tagbar"
        // onClick={focus the input}
      >
        {this.props.tags.map(tag => (
          <span
            className="tagbar-tag"
            key={tag}
          >
            {tag}
            <button>
              X
            </button>
          </span>
        ))}
        <input
          ref={(node) => { this.input = node; }}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          className="tagbar-ctrl"
          placeholder="tags..."
        />
        {/* <div className="menucontainer">
          <button onClick={this.openModal}>
            Open
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={style}
          >
            {this.props.me.tags.map(tag => (
              <span>
                {tag.label}
              </span>
            ))}
          </Modal>
        </div> */}
      </div>
    );
  }
}

TagBar.propTypes = {
  tags: PropTypes.array,
  me: PropTypes.object,
  onAddTag: PropTypes.func.isRequired,
  onRemoveTag: PropTypes.func.isRequired,
};

TagBar.defaultProps = {
  tags: [],
};

// module.exports = TagBar;

export default createFragmentContainer(TagBar, {
  me: graphql`
    fragment TagBar_me on User {
      tags {
        id
        label
        color
      }
    }
  `,
});
