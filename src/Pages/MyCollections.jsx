import React from 'react'
import { Grid, Item, Image, Icon, Container, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import Topics from '../components/Topics'
import PostBlock from '../components/PostBlock'
import firebase from '../utils/firebase'

export default function MyCollections({user}) {
  const [posts, setPosts] = React.useState([])
  React.useEffect(() => {
    firebase.firestore().collection('posts').where("collectedBy","array-contains",firebase.auth().currentUser.uid).get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        const id = doc.id
        return {...doc.data(), id}
      })
      
      
    setPosts(data)
    console.log("收藏",data);
    })
  }, [])

  return <Container>
        <Header>我的收藏</Header>
          <Item.Group>
          {posts.map(post => {
            return <PostBlock post={post}/>
          })}
          </Item.Group>
  </Container>
}
