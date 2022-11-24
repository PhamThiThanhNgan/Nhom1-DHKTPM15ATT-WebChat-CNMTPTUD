import React, { useState } from "react";
import './chatBody.scss'
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import Nav from "../nav/Nav";
// import UserProfile from "../userProfile/UserProfile";

function ChatBody() {
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="main__chatbody">
      <Nav />
      <ChatList />
      <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      {/* <UserProfile /> */}
    </div>
  );
};

export default ChatBody;
