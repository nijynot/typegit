import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import MemoryPage from '../pages/Memory/MemoryPage.js';

const mountNode = document.getElementById('root');
const memory_id = document.location.pathname.split('/', 2)[1];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query MemoryPageQuery($id: String!) {
        ...App_query
        ...MemoryPage_query
      }
    `}
    variables={{ id: memory_id }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <MemoryPage query={props} />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
