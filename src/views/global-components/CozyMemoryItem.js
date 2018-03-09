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
    const diff = differenceInMinutes(new Date(), new Date(`${this.props.repository.created}Z`));
    return moment.utc(this.props.repository.created).local().format('dddd, MMMM Do, YYYY');
    // if (diff > 4320) {
    //   return moment(this.props.memory.created).format('dddd, MMMM Do, YYYY');
    // }
    // return moment(moment.utc(this.props.memory.created)).fromNow();
  }
  render() {
    return (
      <div className="cozymemoryitem">
        <div className="cozymemory-header">
          <a href={`/${fromGlobalId(this.props.repository.id).id}`}>
            <span className="title">
              {this.props.repository.title || 'Untitled post'}
            </span>
            {/* <div className="cozymemory-content pre-wrap">
              {(this.props.memory.body) ?
                <Markdown
                  source={this.props.memory.body}
                  format="block"
                /> :
                <span className="empty-body">
                  Empty body
                </span>}
            </div> */}
          </a>
        </div>
        <span className="timestamp">
          {this.renderTimestamp()}
        </span>
      </div>
    );
  }
}

CozyMemoryItem.propTypes = {
  repository: PropTypes.object.isRequired,
};

export default createFragmentContainer(CozyMemoryItem, {
  repository: graphql`
    fragment CozyMemoryItem_repository on Repository {
      id
      title
      description
      created
    }
  `,
});
