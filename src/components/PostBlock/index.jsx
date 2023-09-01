import React from 'react';
import { Grid, Item, Image, Icon, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function PostBlock({ post }) {
  return (
    <Item key={post.id} as={Link} to={`/posts/${post.id}`}>
      <Item.Image
        src={post.imageUrl || 'https://react.semantic-ui.com/images/wireframe/image.png'}
        size="tiny"
      />
      <Item.Content>
        <Item.Header>{post.title}</Item.Header>
        <Item.Meta>
          {post.author.photoURL ? (
            <Image src={post.author.photoURL} avatar />
          ) : (
            <Icon name="user circle" />
          )}
          {post.topic} · {post.author.displayName || '匿名使用者'}
        </Item.Meta>
        <Item.Description>{post.content}</Item.Description>
        <Item.Extra>
          {' '}
          留言 {post.commentContent || 0} · 讚 {post.likedBy?.length || 0}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
