import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import TagPage from '../pages/Tag/TagPage.js';

const mountNode = document.getElementById('root');
const tag = document.location.pathname.split('/', 3)[2];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query TagPageQuery($tag: String) {
        ...App_query
        ...TagPage_query
      }
    `}
    variables={{ tag, query: '' }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <TagPage query={props} />
          </App>
        );
      } else if (err) {
        console.log(err);
      }
      return null;
    }}
  />,
  mountNode
);
