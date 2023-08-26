import React from 'react'
import {useNavigate} from 'react-router-dom'
import firebase from '../utils/firebase'
import { Container, Header, Form, Image, Button } from 'semantic-ui-react'

export default function NewPost() {
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [topics, setTopics] = React.useState('')
  const [topicName, setTopicName] = React.useState('')
  const [file, setFile] = React.useState('')

  React.useEffect(() => {
    firebase.firestore().collection('topics').get()
    .then((querySnapshot) => {
        let data = querySnapshot.docs.map((doc) => {
            return doc.data()
        })
        data = data.map((topic) => {
          return {
            text : topic.name,
            value : topic.name
          }
        })
        console.log(data);
        setTopics(data)
    })
}, [])

  const previewUrl = file ? URL.createObjectURL(file) : 'https://react.semantic-ui.com/images/wireframe/image.png'

  function onSubmit() {
    console.log('sub');
    const documentRef = firebase.firestore().collection('posts').doc();
    const fileRef = firebase.storage().ref('post-images/' + documentRef.id)
    const metadata = {
      contentType: file.type
    }
    fileRef.put(file, metadata).then(() => {
      fileRef.getDownloadURL().then((url) => {
        // 這個url是上傳到storage的url
        // 可以跟其他資料一起存到firestore
        // 這樣在顯示文章時可以用這個url來取得圖片
        documentRef.set({
          title,
          content,
          topic: topicName,
          createdAt: firebase.firestore.Timestamp.now(),
          author: {
            displayName: firebase.auth().currentUser.displayName || "",
            photoURL: firebase.auth().currentUser.photoURL || "",
            uid: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email
          },
          imageUrl: file ?url : ''
        })
        .then(() => {
          navigate('/posts')
        })
        .catch((error) => {
          console.error(error)
        })
      })
    })
  }
  return (
    <Container>
      <Header>發表文章</Header>
      <Form >
        <Image src={previewUrl} size='small' floated='left' />
        {/* html是用來表明按下去要觸發哪個東西的 */}
        <Button basic as='label' htmlFor="post-image">上傳圖片</Button>
        <Form.Input type='file' id='post-image' style={{display: 'none'}} onChange={(e) => setFile(e.target.files[0])}/>
        <Form.Input placeholder='文章標題' value={title} onChange={(e) => setTitle(e.target.value)}/>
        <Form.TextArea placeholder='文章內容' value={content} onChange={(e) => setContent(e.target.value)}/>
        <Form.Dropdown placeholder='文章分類' selection options={topics} value={topicName} onChange={(e, {value})=>{setTopicName(value)}}/>
        <Form.Button onClick={(e)=>{onSubmit()}}>發表</Form.Button>
      </Form>
    </Container>
  )
}
