import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ClickOutsideListener extends React.Component {
  constructor(props) {
    super(props);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }
  /* using fat arrow to bind to instance */
  handleDocumentClick(evt) {
    const area = this.node;
    if (!area.contains(evt.target)) {
      this.props.onClickOutside(evt);
    }
  }
  render() {
    return (
      <div
        ref={(node) => { this.node = node; }}
        className={classNames('clickoutsidelistener', this.props.className)}
      >
        {this.props.children}
      </div>
    );
  }
}

ClickOutsideListener.propTypes = {
  className: PropTypes.string,
  onClickOutside: PropTypes.func.isRequired,
};

module.exports = ClickOutsideListener;
