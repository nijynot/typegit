import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import HistoryPage from '../pages/History/HistoryPage.js';

const mountNode = document.getElementById('root');
const params = document.location.pathname.split('/', 3);
const repositoryId = params[1];
const commitOid = params[2];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query HistoryPageQuery($repositoryId: String) {
        ...App_query
        ...HistoryPage_query
      }
    `}
    variables={{ repositoryId, commitOid }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <HistoryPage
              query={props}
            />
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
