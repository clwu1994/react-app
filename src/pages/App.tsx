import React from 'react';
import Layout from '../components/layout'
import Button from '../components/button'
const { Header, Footer, Content } = Layout;
const App: React.FC = () => {
  return (
    <div className="App">
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
      <Button type='primary' icon='plus'>主题色</Button>
      <Button type='danger'>危险</Button>
      <Button type='ghost'>幽灵</Button>
    </div>
  );
}

export default App;
