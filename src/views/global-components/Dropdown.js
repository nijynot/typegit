import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DropdownMenu from 'global-components/DropdownMenu.js';

class Dropdown extends React.Component {
  render() {
    return (
      <div
        className={classNames('dropdown', { none: !this.props.isOpen })}
      >
        {(this.props.isOpen) ?
          <DropdownMenu
            {...this.props}
          >
            {this.props.children}
          </DropdownMenu> : null}
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

module.exports = Dropdown;
