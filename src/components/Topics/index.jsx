import React from 'react';
import firebase from '../../utils/firebase';
import { List } from 'semantic-ui-react';

export default function Topics() {
  const [topics, setTopics] = React.useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('topics')
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setTopics(data);
      });
  }, []);
  return (
    <List animated selection>
      {topics.map((topic) => {
        return <List.Item>{topic.name}</List.Item>;
      })}
    </List>
  );
}
