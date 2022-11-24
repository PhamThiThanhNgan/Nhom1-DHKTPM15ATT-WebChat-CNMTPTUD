import React, { Component } from "react";
import "./userProfile.css";
import ngan from '../../asset/image/ngan.jpg'
export default class UserProfile extends Component {
  toggleInfo = (e) => {
    e.target.parentNode.classList.toggle("open");
  };
  render() {
    return (
      <div className="main__userprofile">
        <div className="profile__card user__profile__image">
          <div className="profile__image">
            <img src={ngan} />
          </div>
          <h4>Phạm Thị Thanh Ngân</h4>
          <p> Đại học Công Ngiệp</p>
        </div>
        <div className="profile__card">
          <div className="card__header" onClick={this.toggleInfo}>
            <h4> Thông tin</h4>
            <i className="fa fa-angle-down"></i>
          </div>
          <div className="card__content">
             Hi mình là Ngân
          </div>
        </div>
      </div>
    );
  }
}
