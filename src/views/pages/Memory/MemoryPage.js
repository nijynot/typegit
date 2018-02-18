import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
import stringLength from 'string-length';
import moment from 'moment';

import MetaPortal from 'global-components/MetaPortal.js';
import Markdown from 'global-components/Markdown.js';

class MemoryPage extends React.Component {
  render() {
    return (
      <div className="memorypage">
        <h1 className="memory-title">
          {this.props.query.memory.title}
        </h1>
        <span className="memory-timestamp">{moment.utc(this.props.query.memory.created).local().format('dddd, MMMM Do, YYYY')}</span>
        <div className="markdown-body memory-body">
          <Markdown
            source={this.props.query.memory.body || ''}
          />
        </div>
        {/* <p className="memory-body pre-wrap">
          {this.props.query.memory.body}
        </p> */}
        <MetaPortal>
          <span className="meta-count left">
            <b>
              {stringLength(this.props.query.memory.body || '') +
                stringLength(this.props.query.memory.title || '')}
            </b>{' '}characters
          </span>
          <a
            href={`/${fromGlobalId(this.props.query.memory.id).id}/edit`}
            className="memory-edit-btn right"
          >
            Edit
          </a>
        </MetaPortal>
      </div>
    );
  }
}

MemoryPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(MemoryPage, {
  query: graphql`
    fragment MemoryPage_query on Query {
      memory(id: $id) {
        id
        title
        body
        created
        user {
          id
        }
      }
    }
  `,
});
