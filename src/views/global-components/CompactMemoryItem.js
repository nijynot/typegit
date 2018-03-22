// import React from 'react';
// import PropTypes from 'prop-types';
// import {
//   createFragmentContainer,
//   graphql,
// } from 'react-relay';
// import classNames from 'classnames';
// import format from 'date-fns/format';
// import { fromGlobalId } from 'graphql-base64';
// // import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
// import moment from 'moment';
// import differenceInMinutes from 'date-fns/difference_in_minutes';
//
// class CompactMemoryItem extends React.Component {
//   constructor(props) {
//     super(props);
//     this.renderTimestamp = this.renderTimestamp.bind(this);
//   }
//   renderTimestamp() {
//     const diff = differenceInMinutes(new Date(), new Date(`${this.props.memory.created}Z`));
//     // if (diff > 4320) {
//     //   return moment(this.props.memory.created).format('DD-MM-YYYY');
//     // }
//     // return moment(moment.utc(this.props.memory.created)).fromNow();
//     return moment.utc(this.props.memory.created).local().format('dddd, MMMM Do, YYYY');
//   }
//   render() {
//     return (
//       <div className="compactmemoryitem">
//         <span className={classNames('compactmemoryitem-title', {
//           'no-title': !this.props.memory.title,
//         })}
//         >
//           <a href={`/${fromGlobalId(this.props.memory.id).id}`}>
//             {this.props.memory.title || 'Untitled memory'}
//           </a>
//         </span>
//         <span className="compactmemoryitem-created">
//           {/* {format(this.props.memory.created, 'YYYY-MM-DD')} */}
//           {/* ({distanceInWordsToNow(this.props.memory.created.toISOString(), { addSuffix: true })}) */}
//           {this.renderTimestamp()}
//         </span>
//         &nbsp;—&nbsp;
//         <span className={classNames('compactmemoryitem-body', {
//           'no-body': !this.props.memory.body,
//         })}
//         >
//           {this.props.memory.body || 'Empty body'}
//         </span>
//       </div>
//     );
//   }
// }
//
// CompactMemoryItem.propTypes = {
//   memory: PropTypes.object.isRequired,
// };
//
// export default createFragmentContainer(CompactMemoryItem, {
//   memory: graphql`
//     fragment CompactMemoryItem_memory on Memory {
//       id
//       title
//       body
//       created
//     }
//   `,
// });
