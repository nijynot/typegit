import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ClickOutsideListener from 'global-components/ClickOutsideListener.js';

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isMenuActive: false,
    // };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    // this.hideMenu = this.hideMenu.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }
  handleDocumentClick(event) {
    // const area = ReactDOM.findDOMNode(this.refs.area);
    // const { area } = this;

    if (!this.area.contains(event.target) && this.props.isOpen) {
      console.log('CLICK WAS OUTSIDE');
      this.props.onRequestClose();
    }
  }
  render() {
    return (
      <ul
        className={classNames(
          'menu-modal-portal',
          this.props.className
        )}
        ref={(input) => { this.area = input; }}
        style={{
          display: (this.props.isOpen) ? 'block' : 'none',
        }}
      >
        {this.props.children}
      </ul>
    );
  }
}

DropdownMenu.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

module.exports = DropdownMenu;
