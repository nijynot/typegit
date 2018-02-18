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
        ...App_query
        ...DraftingPage_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <DraftingPage
              query={props}
            />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
