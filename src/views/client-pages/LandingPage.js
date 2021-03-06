import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import LandingPage from '../pages/Landing/LandingPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query LandingPageQuery {
        ...App_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <LandingPage />
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
