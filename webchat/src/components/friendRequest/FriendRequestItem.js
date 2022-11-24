import React from "react";
import { Button } from "react-bootstrap";
import Avatar from "../chatList/Avatar";

const FriendRequestItem = ({ name, animationDelay, active, isOnline, image, handleAccept, handleDeny }) => {

     return (
          <div className="mb-3">
               <div
                    style={{ animationDelay: `0.${animationDelay}s` }}
                    // onClick={handleSelectedChat}
                    className={`chatlist__item ${active ? active : ""
                         }`}
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
               </div>
               <div className="d-flex justify-content-evenly">
                    <Button variant="outline-primary" onClick={() => { handleAccept()} }>Đồng ý</Button>
                    <Button variant="outline-danger" onClick={() => { handleDeny() }}>Từ chối</Button>
               </div>
          </div>
     );
}

export default FriendRequestItem;