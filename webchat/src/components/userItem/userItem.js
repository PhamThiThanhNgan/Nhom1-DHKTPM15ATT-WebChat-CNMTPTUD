import React from "react";
import { Button } from "react-bootstrap";
import { useUserStore } from "../../store/store";
import Avatar from "../chatList/Avatar";

const UserItem = ({ userId, name, animationDelay, active, isOnline, image, handleAddFriend, handleSelectedChat }) => {
  
  const User = useUserStore(state => state.user);
  const haveFriend = User.friends.find(item => item._id === userId);

  console.log(haveFriend);
    
  return (
      <div
        style={{ animationDelay: `0.${animationDelay}s` }}
        // onClick={handleSelectedChat}
        className={`chatlist__item ${
          active ? active : ""
        } justify-content-between`}
      >
        <div className="d-flex">
        <Avatar
          image={
            image ? image : "http://placehold.it/80x80"
          }
          isOnline={isOnline}
        />

        <div className="userMeta">
          <p>{name}</p>
          <span className="activeTime">32 phút trước</span>
        </div>
        </div>
        {
          handleSelectedChat
            ? <Button variant="outline-primary" onClick={handleSelectedChat}>Thêm</Button>
            : haveFriend ? '' : <Button variant="outline-primary" onClick={handleAddFriend}>Kết bạn</Button>
        }
      </div>
    );
}

export default UserItem;