import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Item,
  Image,
  Icon,
  Container,
  Header,
  Segment,
  Comment,
  Form,
  Message,
} from 'semantic-ui-react';

import Topics from '../components/Topics';
import firebase from '../utils/firebase';

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = React.useState({
    author: {},
  });
  const [commentContent, setCommentContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [warning, setWarning] = React.useState('');
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .onSnapshot((doc) => {
        // 只要有變動就會觸發
        const data = doc.data();
        setPost(data);
      });
    // .get().then((doc) => {
    //     const data = doc.data()
    //     setPost(data)
    // })
    // 這是一次性的
  }, []);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const data = doc.data();
          return data;
        });
        setComments(data);
      });
  }, []);

  function toggle(isActive, field) {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .update({
        // 在該文章的被誰收藏的欄位中移除目前使用者的id
        [field]: isActive
          ? firebase.firestore.FieldValue.arrayRemove(userId)
          : firebase.firestore.FieldValue.arrayUnion(userId),
      });
    // if(isActive){
    //     firebase.firestore().collection('posts').doc(postId).update({
    //         // 在該文章的被誰收藏的欄位中移除目前使用者的id
    //         [field]: firebase.firestore.FieldValue.arrayRemove(userId)
    //     })
    // }
    // else{
    //     firebase.firestore().collection('posts').doc(postId).update({
    //         // 在該文章的被誰收藏的欄位中加入目前使用者的id
    //         [field]: firebase.firestore.FieldValue.arrayUnion(userId)
    //     })
    // }
  }

  // 上面那個function是下面兩個function的結合
  function toggleCollected() {
    const userId = firebase.auth().currentUser.uid;
    if (isCollected) {
      firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .update({
          // 在該文章的被誰收藏的欄位中移除目前使用者的id
          collectedBy: firebase.firestore.FieldValue.arrayRemove(userId),
        });
    } else {
      firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .update({
          // 在該文章的被誰收藏的欄位中加入目前使用者的id
          collectedBy: firebase.firestore.FieldValue.arrayUnion(userId),
        });
    }
  }

  function toggleLiked() {
    const userId = firebase.auth().currentUser.uid;
    if (isLiked) {
      firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .update({
          // 在該文章的被誰收藏的欄位中移除目前使用者的id
          likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
        });
    } else {
      firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .update({
          // 在該文章的被誰收藏的欄位中加入目前使用者的id
          likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
        });
    }
  }

  const isCollected = post.collectedBy?.includes(firebase.auth().currentUser.uid); // 如果post有collectedBy欄位 則判斷是否已被目前使用者收藏

  const isLiked = post.likedBy?.includes(firebase.auth().currentUser.uid);

  function onSubmit() {
    if (commentContent.trim() === '') {
      setWarning('請輸入留言內容');
      return;
    }
    setIsLoading(true);
    const firestore = firebase.firestore();

    const batch = firestore.batch(); // 一次執行多個操作 這樣多個操作會同時成功或失敗

    const postRef = firestore.collection('posts').doc(postId);
    batch.update(postRef, {
      // 如果有這個欄位就加1 沒有就設為1
      commentContent: firebase.firestore.FieldValue.increment(1),
    });

    const commentRef = postRef.collection('comments').doc();
    batch.set(commentRef, {
      content: commentContent,
      createdAt: firebase.firestore.Timestamp.now(),
      author: {
        uid: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName || '',
        photoURL: firebase.auth().currentUser.photoURL || '',
      },
    });

    batch.commit().then(() => {
      setCommentContent('');
      setIsLoading(false);
      setWarning('');
    });
  }

  return (
    <Container>
      {post.author.photoURL ? <Image src={post.author.photoURL} /> : <Icon name="user circle" />}
      {post.author.displayName || '匿名使用者'}
      <Header as="h1">
        {post.title}
        <Header.Subheader>
          {post.topic} · {post.createdAt && post.createdAt.toDate().toLocaleString()}
        </Header.Subheader>
      </Header>
      <Image
        src={post.imageUrl || 'https://react.semantic-ui.com/images/wireframe/image.png'}
        fluid
      />
      <Segment basic vertical>
        {post.content}
      </Segment>
      <Segment basic vertical>
        留言 {comments.length} &nbsp; 讚 {post.likedBy ? post.likedBy.length : 0} &nbsp;&nbsp;&nbsp;
        <Icon
          name={`thumbs up ${isLiked ? '' : 'outline'}`}
          color={`${isLiked ? 'blue' : 'grey'}`}
          link
          onClick={() => {
            toggle(isLiked, 'likedBy');
          }}
        />
        <Icon
          name={isCollected ? 'bookmark' : 'bookmark outline'}
          color={isCollected ? 'blue' : 'grey'}
          link
          onClick={() => {
            toggle(isCollected, 'collectedBy');
          }}
        />
      </Segment>
      <Comment.Group>
        <Form reply>
          <Form.TextArea
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
          />
          <Form.Button
            onClick={() => {
              onSubmit();
            }}
            loading={isLoading}
          >
            留言
          </Form.Button>
        </Form>
        {warning ? <Message color="red">{warning}</Message> : ''}
        <Header>共 {comments.length} 則留言</Header>
        {comments.map((comment) => {
          return (
            <Comment>
              <Comment.Avatar
                src={
                  comment.author.photoURL ||
                  'https://react.semantic-ui.com/images/avatar/small/matt.jpg'
                }
              />
              <Comment.Content>
                <Comment.Author as="span">
                  {comment.author.displayName || '匿名使用者'}
                </Comment.Author>
                <Comment.Metadata>
                  {comment.createdAt && comment.createdAt.toDate().toLocaleString()}
                </Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          );
        })}
      </Comment.Group>
    </Container>
  );
}
