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
        viewer {
          ...App_viewer
          ...InsightsPage_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        console.log(props);
        return (
          <App
            viewer={props.viewer}
          >
            <InsightsPage viewer={props.viewer} />
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
