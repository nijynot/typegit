import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import format from 'date-fns/format';
import { fromGlobalId } from 'graphql-base64';
// import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import moment from 'moment';

class CompactMemoryItem extends React.Component {
  render() {
    return (
      <div className="compactmemoryitem">
        <span className="compactmemoryitem-created">
          {/* {format(this.props.memory.created, 'YYYY-MM-DD')} */}
          {/* ({distanceInWordsToNow(this.props.memory.created.toISOString(), { addSuffix: true })}) */}
          ({moment(moment.utc(this.props.memory.created)).fromNow()})
        </span>
        <span className={classNames('compactmemoryitem-title', {
          'no-title': !this.props.memory.title,
        })}
        >
          <a href={`/${fromGlobalId(this.props.memory.id).id}`}>
            {this.props.memory.title || '~ no title ~'}
          </a>
        </span>
        &nbsp;—&nbsp;
        <span className={classNames('compactmemoryitem-body', {
          'no-body': !this.props.memory.body,
        })}
        >
          {this.props.memory.body || '~ no body ~'}
        </span>
      </div>
    );
  }
}

CompactMemoryItem.propTypes = {
  memory: PropTypes.object.isRequired,
};

module.exports = CompactMemoryItem;
