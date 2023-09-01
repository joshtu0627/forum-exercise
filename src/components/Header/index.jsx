import { Menu, Search } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';

import firebase from '../../utils/firebase';
import React from 'react';

function Header({ user }) {
  const navigate = useNavigate();
  return (
    <Menu>
      <Menu.Item as={Link} to="/posts">
        Social
      </Menu.Item>
      <Menu.Item>
        <Search />
      </Menu.Item>
      <Menu.Menu position="right">
        {user ? (
          <>
            <Menu.Item as={Link} to="/new-post">
              發表文章
            </Menu.Item>
            <Menu.Item as={Link} to="/my/posts">
              會員
            </Menu.Item>
            <Menu.Item
              as={Link}
              onClick={() => {
                firebase.auth().signOut();
                navigate('/posts');
              }}
            >
              登出
            </Menu.Item>
          </>
        ) : (
          <Menu.Item as={Link} to="/signin">
            註冊/登入
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
