import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grid, Container } from 'semantic-ui-react';

import Dummy from '../components/dummy';
import MyMenu from '../components/MyMenu';
import MyPosts from './MyPosts';
import MyCollections from './MyCollections';
import MySettings from './MySettings';

export default function Profile({ user }) {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MyMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Routes>
              <Route path="posts" element={<MyPosts user={user} />} />
              <Route path="collections" element={<MyCollections user={user} />} exact />
              <Route path="settings" element={<MySettings user={user} />} exact />
            </Routes>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
