import React from 'react'
import { Grid, Item, Image, Icon, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import Topics from '../components/Topics'
import PostBlock from '../components/PostBlock'
import firebase from '../utils/firebase'

export default function Posts() {
  const [posts, setPosts] = React.useState([])
  React.useEffect(() => {
    firebase.firestore().collection('posts').get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        const id = doc.id
        return {...doc.data(), id}
      })
      console.log(data);
      
    setPosts(data)
    })
    console.log(typeof data);
  }, [])

  return <Container>
          <Item.Group>
          {posts.map(post => {
            return <PostBlock post={post}/>
          })}
          </Item.Group>
  </Container>
}
