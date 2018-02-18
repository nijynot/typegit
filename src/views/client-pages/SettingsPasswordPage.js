import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import SettingsRootPage from '../pages/SettingsRoot/SettingsRootPage.js';
import SettingsPasswordPage from '../pages/SettingsPassword/SettingsPasswordPage.js';

const mountNode = document.getElementById('root');
// const memory_id = document.location.pathname.split('/', 2)[1];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query SettingsPasswordPageQuery {
        ...App_query
        ...SettingsRootPage_query
        ...SettingsPasswordPage_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <SettingsRootPage
              query={props}
              active="password"
            >
              <SettingsPasswordPage query={props} />
            </SettingsRootPage>
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
