import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay';

import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import CozyMemoryItem from 'global-components/CozyMemoryItem.js';

class HomeMemories extends React.Component {
  constructor(props) {
    super(props);
    this._loadMore = this._loadMore.bind(this);
  }
  _loadMore() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      limit: this.props.viewer.memories.edges.length + 20,
    });
    this.props.relay.refetch(refetchVariables, null);
  }
  render() {
    return (
      <div className="homememories">
        {this.props.viewer.memories.edges.map((memory) => {
          return (
            // <CompactMemoryItem
            //   key={memory.id}
            //   memory={memory}
            // />
            <CozyMemoryItem
              key={memory.id}
              memory={memory}
            />
          );
        })}
        <button
          className="homememories-load-btn"
          onClick={this._loadMore}
        >
          Load more
        </button>
      </div>
    );
  }
}

HomeMemories.propTypes = {

};

export default createRefetchContainer(
  HomeMemories,
  {
    viewer: graphql`
      fragment HomeMemories_viewer on Viewer @argumentDefinitions(
        limit: { type: "Int!", defaultValue: 10 }
      ) {
        memories(limit: $limit) {
          edges {
            ...CompactMemoryItem_memory
            ...CozyMemoryItem_memory
          }
        }
      }
    `,
  },
  graphql`
    query HomeMemoriesRefetchQuery($limit: Int!) {
      viewer {
        ...HomeMemories_viewer @arguments(limit: $limit)
      }
    }
  `,
);
