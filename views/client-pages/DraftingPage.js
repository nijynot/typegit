import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import DraftingPage from '../pages/Drafting/DraftingPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query DraftingPageQuery {
        viewer {
          ...App_viewer,
          ...DraftingPage_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App viewer={props.viewer}>
            <DraftingPage viewer={props.viewer} />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
