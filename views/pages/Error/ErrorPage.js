import React from 'react';
import PropTypes from 'prop-types';

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="errorpage clearfix">
        <h1>
          Page not found!
        </h1>
      </div>
    );
  }
}

ErrorPage.propTypes = {

};

module.exports = ErrorPage;
