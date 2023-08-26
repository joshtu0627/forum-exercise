import React from 'react'
import firebase from '../../utils/firebase'
import { List } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom';


export default function MyMenu() {
    const location = useLocation()
    const menuItems = [{
        name: '我的文章',
        path: '/my/posts'
    },{
        name: '我的收藏',
        path: '/my/collections'
    },{
        name: '會員設定',
        path: '/my/settings'
    }]
    return <List animated selection>
        {menuItems.map((item) => {
            return <List.Item as={Link} to={item.path} key={item.name} active={item.path === location.pathname}>{item.name}</List.Item>
        })}
    </List>
}
