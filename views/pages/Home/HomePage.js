import React from 'react';
import PropTypes from 'prop-types';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import CompactMemoryItem from './components/CompactMemoryItem.js';

class HomePage extends React.Component {
  render() {
    console.log(this.props.viewer);
    return (
      <div className="homepage">
        {this.props.viewer.memories.map((memory) => {
          return (
            <CompactMemoryItem
              memory={memory}
            />
            // <div>
            //   {memory.title || '~ No title. ~'}
            // </div>
          );
        })}
      </div>
    );
  }
}

HomePage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(HomePage, {
  viewer: graphql`
    fragment HomePage_viewer on Viewer {
      memories {
        id
        title
        body
        created
        tags {
          id
          label
          color
        }
      }
    }
  `,
});
