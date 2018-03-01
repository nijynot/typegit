import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class InsightsPage extends React.Component {
  render() {
    return (
      <div className="insightspage">
        <div className="insights-row clearfix">
          <div className="insights-panel left">
            <h2>
              Average Characters per Memory
            </h2>
            <span className="insights-number">
              {this.props.query.me.averageCharactersPerMemory}
            </span>
          </div>
          <div className="insights-panel left">
            <h2>
              Total number of Characters
            </h2>
            <span className="insights-number">
              {this.props.query.me.totalCharacters}
            </span>
          </div>
        </div>
        <div className="insights-row clearfix">
          <div className="insights-panel left">
            <h2>
              Most used Tags
            </h2>
            {this.props.query.me.mostUsedTags.map(tag => (
              <div className="insights-tag">
                <a className="tweet-url hashtag" href={`/tag/${tag.tag}`}>
                  #{tag.tag}
                  <span className="insights-tag-count">
                    {' '}[{tag.count}]
                  </span>
                </a>
              </div>
            ))}
          </div>
          <div className="insights-panel left">
            <h2>
              Total number of Tags
            </h2>
            <span className="insights-number">
              {this.props.query.me.totalTags}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

InsightsPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(InsightsPage, {
  query: graphql`
    fragment InsightsPage_query on Query {
      id
      me {
        averageCharactersPerMemory
        totalCharacters
        mostUsedTags {
          tag
          count
        }
        totalTags
      }
    }
  `,
});
