import React, { useEffect, useState } from 'react'
import { getMe } from '../../service/AuthService';
import { useUserStore } from '../../store/store';
import '../../components/chatBody/chatBody.scss'
import Nav from "../../components/nav/Nav";
import ChatList from "../../components/chatList/ChatList";
import ChatContent from "../../components/chatContent/ChatContent";
import { Outlet } from 'react-router-dom';

const Home = () => {
  const updateUser = useUserStore(state => state.updateUser);
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    getMe()
      .then((response) => {
        updateUser(response?.data?.data);
      })
      .catch((err) => {
        window.localStorage.removeItem('accessToken');
        window.location.reload();
      })
  }, []);
    
  return (
    <div className="main-section">
      <div className="main__chatbody">
        <Nav />
        <Outlet />
        {/* <ChatList /> */}
        <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        {/* <UserProfile /> */}
      </div>
    </div>
  )
}

export default Home