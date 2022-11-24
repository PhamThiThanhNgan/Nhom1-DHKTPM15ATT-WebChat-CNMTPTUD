import React, { Component } from "react";
import Avatar from "../chatList/Avatar";

export default class ChatItem extends Component {
  
  render() {
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        {
          this.props.user === 'me'
            ? <i
              onClick={this.props.deleteMessage}
              style={{ position: 'absolute', top: '0', right: '280px', cursor: 'pointer' }}
              className="fa fa-trash"
              >
              </i>
            : ''
        }
        <div className="chat__item__content">
          <div className="chat__msg">
            {this.props.imgMessage === "" || !this.props.imgMessage
              ? this.props.msg
              : <img src={this.props.imgMessage} alt='' style={{width: '100%', height: '300px'}} /> 
            }
          </div>
          <div className="chat__meta">
            <span>16 phút trước</span>
            <span>Đã xem 1.03PM</span>
          </div>
        </div>
        <Avatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}
