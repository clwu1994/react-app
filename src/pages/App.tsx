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
      <Button type='primary'>登录</Button>
      <Button type='danger'>退出</Button>
    </div>
  );
}

export default App;
