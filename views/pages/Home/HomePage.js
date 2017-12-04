import React from 'react';
import PropTypes from 'prop-types';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import CompactMemoryItem from './components/CompactMemoryItem.js';
import MetaPortal from 'global-components/MetaPortal.js';

class HomePage extends React.Component {
  render() {
    console.log(this.props.viewer);
    return (
      <div className="homepage">
        {this.props.viewer.memories.map((memory) => {
          return (
            <CompactMemoryItem
              key={memory.id}
              memory={memory}
            />
            // <div>
            //   {memory.title || '~ No title. ~'}
            // </div>
          );
        })}
        <MetaPortal>
          <a href="/new" className="home-new-link right text">
            + New Memory
          </a>
        </MetaPortal>
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
        tags
      }
    }
  `,
});
