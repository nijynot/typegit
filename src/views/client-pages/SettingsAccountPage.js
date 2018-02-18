import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import SettingsRootPage from '../pages/SettingsRoot/SettingsRootPage.js';
import SettingsAccountPage from '../pages/SettingsAccount/SettingsAccountPage.js';

const mountNode = document.getElementById('root');
// const memory_id = document.location.pathname.split('/', 2)[1];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query SettingsAccountPageQuery {
        viewer {
          ...App_viewer
          ...SettingsRootPage_viewer
          ...SettingsAccountPage_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            viewer={props.viewer}
          >
            <SettingsRootPage
              viewer={props.viewer}
              active="account"
            >
              <SettingsAccountPage viewer={props.viewer} />
            </SettingsRootPage>
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
