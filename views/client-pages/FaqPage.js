import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import FaqPage from '../pages/Faq/FaqPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query FaqPageQuery {
        viewer {
          ...App_viewer
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
            <FaqPage />
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
