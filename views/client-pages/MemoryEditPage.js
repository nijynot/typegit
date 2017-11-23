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
        viewer {
          ...App_viewer,
          ...MemoryEditPage_viewer
        }
      }
    `}
    variables={{ id: memory_id }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            viewer={props.viewer}
            memory={null}
          >
            <MemoryEditPage viewer={props.viewer} />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
