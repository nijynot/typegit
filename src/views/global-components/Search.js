import React from 'react';
import PropTypes from 'prop-types';
import {
  graphql,
  createRefetchContainer,
} from 'react-relay';
import AriaModal from 'react-aria-modal';
import cx from 'classnames';
import get from 'lodash/get';

import CozyMemoryItem from 'global-components/CozyMemoryItem.js';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalActive: false,
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getApplicationNode = this.getApplicationNode.bind(this);
    this.getProps = this.getProps.bind(this);
    this._search = this._search.bind(this);
  }
  onChangeSearch() {
    if (this._throttleTimeout) {
      clearTimeout(this._throttleTimeout);
    }
    this._throttleTimeout = setTimeout(
      this._search,
      200
    );
  }
  getApplicationNode() {
    return document.getElementById('root-modal');
  }
  getProps() {
    console.log(this.props);
  }
  openModal() {
    this.setState({ modalActive: true });
  }
  closeModal() {
    this.setState({ modalActive: false });
  }
  _search() {
    console.log(this.search.value);
    this.props.relay.refetch(
      { query: this.search.value }, // Our refetchQuery needs to know the `itemID`
      null, // We can use the refetchVariables as renderVariables
      () => { console.log('Refetch done'); },
      { force: true },
    );
  }
  render() {
    return (
      <div className="search clearfix">
        <span
          className="meta-search right"
          onClick={this.openModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -3 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
            <circle cx="10.5" cy="10.5" r="7.5" />
            <line x1="21" y1="21" x2="15.8" y2="15.8" />
          </svg>
        </span>
        {(this.state.modalActive) ?
          <AriaModal
            titleText="search"
            // onExit={this.closeModal}
            initialFocus="#search-ctrl"
          >
            <div id="search-modal">
              <div className="search-content">
                <div className="search-header">
                  <div className="search-heading header-heading right">
                    <span
                      className="search-heading-sentence"
                    >
                      Search —&nbsp;
                    </span>
                    <a href="/">
                      {this.props.query.me.heading || 'Typegit'}
                    </a>
                    <button
                      onClick={this.closeModal}
                      className="search-close-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <input
                  id="search-ctrl"
                  placeholder="Enter keywords..."
                  ref={(node) => { this.search = node; }}
                  onChange={this.onChangeSearch}
                />
                <div className="search-results">
                  {get(this.props.query, 'search.edges', []).map(edge => (
                    <CozyMemoryItem
                      key={edge.node.id}
                      memory={edge.node}
                    />
                  ))}
                </div>
              </div>
            </div>
          </AriaModal> : null}
      </div>
    );
  }
}

Search.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createRefetchContainer(
  Search,
  graphql`
    fragment Search_query on Query
    @argumentDefinitions(
      query: { type: "String", defaultValue: "" }
    ) {
      me {
        heading
      }
      # search(query: $query, first: 10) {
      #   edges {
      #     node {
      #       id
      #     }
      #   }
      # }
    }
  `,
  graphql`
    query SearchRefetchQuery($query: String) {
      ...Search_query @arguments(query: $query)
    }
  `
);


// ...CozyMemoryItem_memory
