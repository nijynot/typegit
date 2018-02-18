import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import MetaPortal from 'global-components/MetaPortal.js';
import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import Search from 'global-components/Search.js';

class TagPage extends React.Component {
  render() {
    return (
      <div className="homepage">
        {this.props.query.tag.memories.edges.map((edge) => {
          return (
            <CompactMemoryItem
              key={edge.node.id}
              memory={edge.node}
            />
          );
        })}
        <MetaPortal>
          <a href="/new" className="meta-plus home-new-link right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </a>
          <Search query={this.props.query} />
          {/* <span className="meta-search right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -3 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
              <circle cx="10.5" cy="10.5" r="7.5" />
              <line x1="21" y1="21" x2="15.8" y2="15.8" />
            </svg>
          </span> */}
        </MetaPortal>
      </div>
    );
  }
}

TagPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(TagPage, {
  query: graphql`
    fragment TagPage_query on Query {
      ...Search_query @arguments(query: $query)
      tag(tag: $tag) {
        memories(first: 10) {
          edges {
            node {
              ...CompactMemoryItem_memory
            }
          }
        }
      }
    }
  `,
});
