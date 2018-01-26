import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';
import { cursorToOffset } from 'graphql-relay';

import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import CozyMemoryItem from 'global-components/CozyMemoryItem.js';

class HomeMemories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    };
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  previousPage() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      limit: 10,
      offset: this.state.offset - 10,
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
    this.setState({ offset: this.state.offset - 10 });
  }
  nextPage() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      limit: 10,
      offset: this.state.offset + 10,
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
    this.setState({ offset: this.state.offset + 10 });
  }
  render() {
    return (
      <div className="homememories clearfix">
        <div className="clearfix">
          {(this.props.viewer.memories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          {(this.props.viewer.memories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div>
        {this.props.viewer.memories.edges.map((edge) => {
          return (
            // <CompactMemoryItem
            //   key={memory.id}
            //   memory={memory}
            // />
            <CozyMemoryItem
              key={edge.node.id}
              memory={edge.node}
            />
          );
        })}
        {(isEmpty(this.props.viewer.memories.edges)) ?
          <div className="homememories-empty-msg">
            No memories yet.&nbsp;
            <a href="/new">
              Create a new memory.
            </a>
          </div> : null}
        <div className="homememories-page-btn-container clearfix">
          {(this.props.viewer.memories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          {(this.props.viewer.memories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div>
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
        offset: { type: "Int", defaultValue: 0 }
      ) {
        memories(limit: $limit, offset: $offset) {
          edges {
            node {
              ...CompactMemoryItem_memory
              ...CozyMemoryItem_memory
            }
            cursor
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  graphql`
    query HomeMemoriesRefetchQuery($limit: Int!, $offset: Int) {
      viewer {
        ...HomeMemories_viewer @arguments(limit: $limit, offset: $offset)
      }
    }
  `,
);
