import React from 'react';
import { Menu, Form, Container, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import firebase from '../../utils/firebase';

export default function Signin() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState('register');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  function handleRegister() {
    if (activeItem === 'register') {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          // var user = userCredential.user;
          // console.log(user)
          navigate('/');
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          switch (errorCode) {
            case 'auth/email-already-in-use':
              setError('信箱已被註冊');
              break;
            case 'auth/invalid-email':
              setError('信箱格式錯誤');
              break;
            case 'auth/weak-password':
              setError('密碼強度不足');
              break;
            default:
              setError('註冊失敗');
          }
        });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          // var user = userCredential.user;
          // console.log(user)
          navigate('/posts');
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          switch (errorCode) {
            case 'auth/invalid-email':
              setError('信箱格式錯誤');
              break;
            case 'auth/user-disabled':
              setError('帳號已被停用');
              break;
            case 'auth/user-not-found':
              setError('帳號不存在');
              break;
            case 'auth/wrong-password':
              setError('密碼錯誤');
              break;
            default:
              setError('登入失敗');
          }
        });
    }
  }
  return (
    <Container>
      <Menu widths={2}>
        <Menu.Item active={activeItem === 'register'} onClick={() => setActiveItem('register')}>
          註冊
        </Menu.Item>
        <Menu.Item active={activeItem === 'signin'} onClick={() => setActiveItem('signin')}>
          登入
        </Menu.Item>
      </Menu>
      <Form onSubmit={handleRegister}>
        <Form.Input
          label="信箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入信箱"
        ></Form.Input>
        <Form.Input
          label="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
          type="password"
        ></Form.Input>
        {error && <Message>{error}</Message>}
        <Form.Button>{activeItem === 'register' ? '註冊' : '登入'}</Form.Button>
      </Form>
    </Container>
  );
}
