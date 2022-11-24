import './App.css';
import { matchPath, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './screen/Login/Login';
import Register from './screen/Register/Register';
import Home from './screen/Home/Home';
import { useEffect } from 'react';
import { isLogin } from './service/AuthService';
import ForgotPassword from './screen/ForgotPassword/ForgotPassword';
import ResetPassword from './screen/ResetPassword/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatList from './components/chatList/ChatList';
import FriendList from './components/friendList/FriendList';
import FriendRequestList from './components/friendRequest/FriendRequestList';

function App() {

  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => { 
    if (!isLogin()
      && !matchPath("/login", pathname)
      && !matchPath("/register", pathname)
      && !matchPath("/forgot-password", pathname)
      && !matchPath("/reset-password/:id/:token", pathname)
    ) {
      navigate("/login");
    }
    if (isLogin()
      && (
      matchPath("/login", pathname)
      || matchPath("/register", pathname)
      || matchPath("/forgot-password", pathname)
      || matchPath("/reset-password/:id/:token", pathname)
    )) {
      navigate("/");
    }
  });

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<ChatList />} />
            <Route path="/friends/*" element={<FriendList />} />
            <Route path="/friend-request/*" element={<FriendRequestList />} />
          </Route>
          <Route index path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
