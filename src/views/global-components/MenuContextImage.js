import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class MenuContextImage extends React.Component {
  render() {
    return (
      <div className="menucontextimage">
        <div className="overflow">
          <img
            alt={`${this.props.image.id}-img`}
            src={this.props.image.url}
            onClick={this.props.onClick}
          />
        </div>
      </div>
    );
  }
}

MenuContextImage.propTypes = {
  image: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default createFragmentContainer(MenuContextImage, {
  image: graphql`
    fragment MenuContextImage_image on Image {
      id
      url
      created
    }
  `,
});
