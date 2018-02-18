import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import MemoryEditPage from '../pages/MemoryEdit/MemoryEditPage.js';

const mountNode = document.getElementById('root');
const memory_id = document.location.pathname.split('/', 2)[1];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query MemoryEditPageQuery($id: String!) {
        ...App_query
        ...MemoryEditPage_query
      }
    `}
    variables={{ id: memory_id }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <MemoryEditPage query={props} />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
