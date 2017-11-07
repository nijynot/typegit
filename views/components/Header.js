import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="header-top">
          <span className="header-heading">
            <a href="/">
              DIARY
            </a>
          </span>
          <div className="header-profile right">
            {this.props.user.username}
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
};

module.exports = Header;