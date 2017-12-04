import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="header-metabar clearfix">
          <span className="header-heading">
            <a
              href="/"
              className="header-logo"
            >
              DIARY
            </a>
          </span>
          <div className="header-actions right">
            <div id="header-portal" className="right">
            </div>
            <div className="header-profile right">
              <span className="text">
                {this.props.user.username}
              </span>
            </div>
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
