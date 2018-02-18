import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import InsightsPage from '../pages/Insights/InsightsPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query InsightsPageQuery {
        ...App_query
        ...InsightsPage_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        console.log(props);
        return (
          <App
            query={props}
          >
            <InsightsPage query={props} />
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
