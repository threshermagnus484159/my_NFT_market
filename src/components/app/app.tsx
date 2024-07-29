import { Layout, Button} from 'antd';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const App = () => {
    const navigate = useNavigate();
    //路由跳转
    const router_Nftmarket = () => {
        navigate('/');
    }
    const router_Uniswap = () => {
        navigate('/uniswap');
    }

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={router_Nftmarket}  >NFT market</Button>
          <Button type="primary" onClick={router_Uniswap}>Uniswap</Button>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <ConnectButton />
        </div>

      </Header>

      <Content style={{ margin: '24px 16px 0' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>

    </Layout>
  );
};

export default App;