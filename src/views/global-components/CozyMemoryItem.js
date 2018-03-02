import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import classNames from 'classnames';
import moment from 'moment';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import { fromGlobalId } from 'graphql-base64';

import Markdown from 'global-components/Markdown.js';

class CozyMemoryItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderTimestamp = this.renderTimestamp.bind(this);
  }
  renderTimestamp() {
    const diff = differenceInMinutes(new Date(), new Date(`${this.props.memory.created}Z`));
    return moment.utc(this.props.memory.created).local().format('dddd, MMMM Do, YYYY');
    // if (diff > 4320) {
    //   return moment(this.props.memory.created).format('dddd, MMMM Do, YYYY');
    // }
    // return moment(moment.utc(this.props.memory.created)).fromNow();
  }
  render() {
    return (
      <div className="cozymemoryitem">
        <div className="cozymemory-header">
          <a href={`/${fromGlobalId(this.props.memory.id).id}`}>
            <span className="cozymemory-heading">
              {this.props.memory.title || 'Untitled memory'}
            </span>
          </a>
          <span className="cozymemory-timestamp">
            {this.renderTimestamp()}
          </span>
        </div>
        <div className="cozymemory-content pre-wrap">
          {(this.props.memory.body) ?
            <Markdown
              source={this.props.memory.body}
              format="inline"
            /> :
            <span className="empty-body">
              Empty body
            </span>}
        </div>
      </div>
    );
  }
}

CozyMemoryItem.propTypes = {
  memory: PropTypes.object.isRequired,
};

export default createFragmentContainer(CozyMemoryItem, {
  memory: graphql`
    fragment CozyMemoryItem_memory on Memory {
      id
      title
      body
      created
    }
  `,
});
