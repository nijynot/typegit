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
        </div>
        <div className="header-profile right">
          {(this.props.showEdit) ?
            <a
              href={`/${document.location.pathname.split('/', 2)[1]}/edit`}
              className="header-edit-btn"
            >
              Edit
            </a> : null}
          <a href="/new" className="header-new-btn">
            + New Memory
          </a>
          {this.props.user.username}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
};

module.exports = Header;
