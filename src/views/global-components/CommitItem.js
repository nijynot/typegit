import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class CommitItem extends React.Component {
  render() {
    return (
      <div className="commititem">
        <div className="commititem-container">
          <a
            href={`/${this.props.commit.repository.name}/commit/${this.props.commit.oid}`}
            className="commititem-oid"
          >
            {this.props.commit.oid}
          </a>
        </div>
        <div className="commititem-container">
          commited{' '}
          <span className="commititem-fromnow">
            {moment(moment.utc(this.props.commit.commitedDate)).fromNow()}{' '}
          </span>
          by{' '}
          <span className="commititem-author">
            {(this.props.commit.author.user && this.props.commit.author.user.username) || this.props.commit.author.name}
          </span>{' '}
          <span className="commititem-">
            ({this.props.commit.commitedDate})
          </span>{' '}
        </div>
        {/* <div className="commititem-container">
        </div> */}
        <p className="msg">
          {this.props.commit.message}
        </p>
      </div>
    );
  }
}

CommitItem.propTypes = {
  commit: PropTypes.object.isRequired,
};

export default createFragmentContainer(CommitItem, {
  commit: graphql`
    fragment CommitItem_commit on Commit {
      id
      partialOid
      oid
      message
      commitedDate
      author {
        name
        user {
          username
        }
      }
      repository {
        name
      }
    }
  `,
});
