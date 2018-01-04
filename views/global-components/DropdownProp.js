import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class DropdownProp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownIsActive: false,
    };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
  handleOutsideClick(event) {
    if (!this.area.contains(event.target) && this.state.dropdownIsActive) {
      this.setState({ dropdownIsActive: false });
    }
  }
  openDropdown() {
    this.setState({ dropdownIsActive: !this.state.dropdownIsActive });
  }
  render() {
    return (
      <ul
        className={classNames('dropdownprop', this.props.containerClassName)}
        ref={(input) => { this.area = input; }}
      >
        {this.props.toggle(this.openDropdown)}
        {(this.state.dropdownIsActive) ?

          <div
            className={classNames('dropdownprop-menu', this.props.className)}
          >
            {this.props.children}
          </div>
          : null}
      </ul>
    );
  }
}

DropdownProp.propTypes = {
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

DropdownProp.defaultProps = {
  className: '',
  containerClassName: '',
};

module.exports = DropdownProp;
