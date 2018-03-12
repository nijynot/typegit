import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import CommitPage from '../pages/Commit/CommitPage.js';

const mountNode = document.getElementById('root');
const params = document.location.pathname.split('/', 5);
const repositoryId = params[1];
const oid = params[3];

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query CommitPageQuery($repositoryId: String, $oid: String) {
        ...App_query
        ...CommitPage_query
      }
    `}
    variables={{ repositoryId, oid }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <CommitPage
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
