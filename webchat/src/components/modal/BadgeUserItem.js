import React from 'react';

const BadgeUserItem = ({ user, handleFunction, admin }) => {
  return (
    <div
      className="mr-1 px-2 py-1 m-1 mb-2 w-60"
      style={{ cursor: "pointer", fontSize: "12px", backgroundColor: "#4665ff", borderRadius: "3px", color: "#fff" }}
      onClick={handleFunction}
    >
      {user.username}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <i className="fa-solid fa-xmark" style={{marginLeft: "2px"}}></i>
    </div>
  );
};

export default BadgeUserItem;