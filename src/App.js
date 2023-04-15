// 导入路由
import { Route, Routes } from "react-router-dom";

import "./App.scss";

import { HistoryRouter, history } from "./utils/history";

// 导入必要组件
import { lazy, Suspense } from "react";
// 导入页面组件

// 按需导入路由组件
const Login = lazy(() => import("./pages/Login"));
const Layout = lazy(() => import("./pages/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Article = lazy(() => import("./pages/Article"));
const Publish = lazy(() => import("./pages/Publish"));
const AuthRoute = lazy(() => import("./components/AuthRoute"));

// 配置路由规则
function App() {
  return (
    <HistoryRouter history={history}>
      <Suspense
        fallback={
          <div
            style={{
              textAlign: "center",
              marginTop: 200,
            }}
          >
            loading...
          </div>
        }
      >
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <AuthRoute>
                  <Layout />
                </AuthRoute>
              }
            >
              <Route index element={<Home />}></Route>
              <Route path="article" element={<Article />}></Route>
              <Route path="publish" element={<Publish />}></Route>
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Suspense>
    </HistoryRouter>
  );
}

export default App;
