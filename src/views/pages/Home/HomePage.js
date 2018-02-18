import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Chart from 'chart.js';
import Color from 'color';
import quantile from 'compute-quantile';
import isEmpty from 'lodash/isEmpty';

import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import CozyMemoryItem from 'global-components/CozyMemoryItem.js';
import MetaPortal from 'global-components/MetaPortal.js';
import Search from 'global-components/Search.js';

import HomeMemories from './components/HomeMemories.js';

const cdf = (data) => {
  return quantile.bind(null, data);
};

const indicator = (F, x) => {
  const Q1 = F(0.4);
  const Q2 = F(0.8);
  const Q3 = F(0.9);

  if (x === 1) {
    return 0;
  } else if (x <= Q1) {
    return 0.2;
  } else if (Q1 <= x && x <= Q2) {
    return 0.4;
  } else if (Q2 <= x && x <= Q3) {
    return 0.6;
  }
  return 0.75;
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
  }
  getData() {
    const arr = [];
    const { tags } = this.props.query.me;
    for (let i = 0; i < tags.length; i += 1) {
      if (tags[i].count !== 1) {
        arr.push(tags[i].count);
      }
    }
    return arr;
  }
  render() {
    return (
      <div className="homepage">
        {(this.props.query.me.subscription.current_period_end) ?
          null :
          <div className="home-msg-container">
            <span className="home-read-only-msg">
              Read-Only Mode.&nbsp;
              <a
                className="home-sub-link"
                href="/settings/subscription"
              >
                Subscribe
              </a>
              &nbsp;to gain full permissions.
            </span>
          </div>}
        <div className="home-tags clearfix">
          {this.props.query.me.tags.map(tag => (
            <a
              key={tag.id}
              href={`/tag/${tag.tag}`}
              className="tweet-url hashtag home-tag left"
              style={{
                // color: Color('blue').darken(indicator(cdf(this.getData()), tag.count)),
                // color: 'white',
                // padding: '2px 2px 0 4px',
                // backgroundColor: Color('blue').darken(this.assignQuantile(tag.count)),
              }}
            >
              #{tag.tag}
              {/* <span
                className="home-tag-count"
                style={{
                  // backgroundColor: Color('blue').darken(this.assignQuantile(tag.count)),
                  // color: 'white',
                }}
              >
                ({tag.count})
              </span> */}
            </a>
          ))}
          {(isEmpty(this.props.query.me.tags)) ?
            <span className="home-empty-tag-msg">
              No hashtags yet.
            </span> : null}
        </div>
        <HomeMemories query={this.props.query} />
        <MetaPortal>
          <a href="/new" className="meta-plus home-new-link right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </a>
          <Search query={this.props.query} />
        </MetaPortal>
      </div>
    );
  }
}

HomePage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(HomePage, {
  query: graphql`
    fragment HomePage_query on Query {
      me {
        tags {
          id
          tag
          count
        }
        subscription {
          current_period_end
        }
      }
      ...Search_query @arguments(query: $query)
      ...HomeMemories_query
    }
  `,
});
