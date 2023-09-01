import React from 'react';
import { Grid, Item, Image, Icon, Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Topics from '../components/Topics';
import PostBlock from '../components/PostBlock';
import firebase from '../utils/firebase';

export default function MyPosts({ user }) {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('posts')
      .where('author.uid', '==', firebase.auth().currentUser.uid)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        console.log(data);

        setPosts(data);
      });
    console.log(typeof data);
  }, []);

  return (
    <Container>
      <Header>我的文章</Header>
      <Item.Group>
        {posts.map((post) => {
          return <PostBlock post={post} />;
        })}
      </Item.Group>
    </Container>
  );
}
