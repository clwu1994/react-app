import React from 'react';
import Layout from '../components/layout'
const { Header, Footer, Content } = Layout;
const App: React.FC = () => {
  return (
    <div className="App">
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
