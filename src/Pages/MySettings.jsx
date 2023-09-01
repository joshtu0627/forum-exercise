import React from 'react';
import {
  Grid,
  Item,
  Input,
  Image,
  Icon,
  Container,
  Header,
  Message,
  Button,
  Segment,
  Modal,
} from 'semantic-ui-react';
import firebase from '../utils/firebase';

function MyName({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  function onSubmit() {
    setIsLoading(true);
    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        // 修改成功
        setName('');
        setIsModalOpen(false);
        setIsLoading(false);
      });
  }

  return (
    <Container>
      <Header size="small">
        會員名稱
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>{user.displayName || '未設定'}</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
            placeholder="輸入新的會員名稱"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fluid
          ></Input>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={() => onSubmit()} loading={isLoading}>
            確認
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

function MyPhoto({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const previewImageUrl = file
    ? URL.createObjectURL(file)
    : user.photoURL || 'https://react.semantic-ui.com/images/wireframe/image.png';
  const [isLoading, setIsLoading] = React.useState(false);

  function onSubmit() {
    setIsLoading(true);
    const documentRef = firebase.firestore().collection('posts').doc();
    const fileRef = firebase.storage().ref('post-images/' + documentRef.id);
    const metadata = {
      contentType: file.type,
    };
    fileRef.put(file, metadata).then(() => {
      fileRef.getDownloadURL().then((url) => {
        user
          .updateProfile({
            photoURL: url,
          })
          .then(function () {
            // 修改成功
            setIsLoading(false);
            setFile(null);
            setIsModalOpen(false);
          });
      });
    });
  }

  return (
    <>
      <Header size="small">
        會員照片
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>
        <Image
          src={user.photoURL || 'https://react.semantic-ui.com/images/wireframe/image.png'}
        ></Image>
        {/* <Image src="https://react.semantic-ui.com/images/wireframe/image.png"></Image> */}
      </Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員照片</Modal.Header>
        <Modal.Content image>
          <Image src={previewImageUrl} wrapped />
          <Modal.Description>
            <Button as="label" htmlFor="post-image">
              上傳
            </Button>
            <Input
              type="file"
              id="post-image"
              style={{ display: 'none' }}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={() => onSubmit()} loading={isLoading}>
            確認
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MyPassword({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [warning, setWarning] = React.useState('');

  function onSubmit() {
    setIsLoading(true);
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
    user
      .reauthenticateWithCredential(credential)
      .then(function () {
        // 認證成功
        user
          .updatePassword(newPassword)
          .then(function () {
            // 修改成功
            setOldPassword('');
            setNewPassword('');
            setIsModalOpen(false);
            setIsLoading(false);
          })
          .catch(function (error) {
            // 修改失敗
            console.log(error);
          });
      })
      .catch(function (error) {
        // 認證失敗
        setIsLoading(false);

        console.log(error.code);
        switch (error.code) {
          case 'auth/wrong-password':
            setWarning('舊密碼錯誤');
            break;
          case 'auth/too-many-requests':
            setWarning('請求太多次，請稍後再試');
            break;
          case 'auth/missing-password':
            setWarning('請輸入密碼');
            break;
          default:
            setWarning('發生錯誤');
        }
      });
  }
  return (
    <>
      <Header size="small">
        會員密碼
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>******</Segment>

      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員密碼</Modal.Header>
        <Modal.Content>
          <Header size="mini">目前密碼</Header>
          <Input
            placeholder="輸入舊的密碼"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fluid
          ></Input>
          <Header size="mini">新的密碼</Header>
          <Input
            placeholder="輸入新的密碼"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fluid
          ></Input>
          {warning ? <Message>{warning}</Message> : ''}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={() => onSubmit()} loading={isLoading}>
            確認
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default function MySettings({ user }) {
  return (
    <>
      <Header>會員資料</Header>

      <MyName user={user} />

      <MyPhoto user={user} />

      <MyPassword user={user} />
    </>
  );
}
