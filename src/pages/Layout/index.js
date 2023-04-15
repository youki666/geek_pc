import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "@/store";
import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider } = Layout;

const GeekLayout = () => {
  const { userStore, loginStore, channelStore } = useStore();
  // 获取用户数据
  useEffect(() => {
    try {
      userStore.getUserInfo();
      channelStore.loadChannelList();
    } catch {}
  }, [userStore, channelStore]);
  const location = useLocation();
  // 这里是当前浏览器上的路径地址
  const selectedKey = location.pathname;
  const navigate = useNavigate();
  const onLogout = () => {
    loginStore.loginOut();
    navigate("/login");
  };
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={onLogout}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="1">
              <Link to="/">数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="2">
              <Link to="/article">内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="3">
              <Link to="/publish">发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(GeekLayout);
