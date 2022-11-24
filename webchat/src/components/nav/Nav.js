import React, { useEffect, useState } from "react";
import '../nav/Nav.scss'

import { Button, Form, Modal } from "react-bootstrap";
import { useUserStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { updateImage, updateName } from "../../service/AuthService";

export default function Nav(props) {

    const navigate = useNavigate();
    const User = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');
    const [disabled, setDisabled] = useState(true);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const SingOut = () => {
        window.localStorage.removeItem('accessToken');
        navigate("/login");
    };

    const handleChangeImage = (event) => {
        const file = event.target.files[0];
        file.preview = URL.createObjectURL(file);
        setImage(file);
        setDisabled(false);
    };

    const handleUploadProfile = () => {
        if (image) {
            updateImage({ _id: User?._id, avatar: image })
                .then((response) => {
                    updateUser(response?.data?.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        updateName({ _id: User?._id, username: username })
            .then((response) => {
                updateUser(response?.data?.user);
            })
            .catch((err) => {
                console.log(err);
            });
        handleClose();
        setDisabled(true);
    };

    useEffect(() => {
        setUsername(User?.username);
    }, [User]);

    return (
        <>
            <div className='containerr'>
                <section className='seting'>
                    <div className='avatar' style={{ marginLeft: '20px', cursor: 'pointer' }}>
                        <div className='avatar-img' onClick={handleShow}>
                            <img src={User?.avatar} alt="avt" />
                        </div>
                    </div>
                    <div className='chatgroup' onClick={() => navigate("/")}><i className="fa fa-comment-dots"></i></div>
                    <div className='list' onClick={() => navigate("/friends")}><i className="fa fa-address-book"></i></div>
                    <div className='add' onClick={() => navigate("/friend-request")}><i className="fa fa-user-plus"></i></div>
                    <div className='cloud'><i className="fa fa-cloud"></i></div>
                    <div className='bussiness'><i className="fa fa-suitcase"></i></div>
                    <div className='cofig'><i className="fa fa-cog"></i></div>
                    <div className='singout' onClick={SingOut}><i className="fa fa-sign-out-alt"></i>

                    </div>
                </section>
            </div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show} onHide={handleClose}
            >
                <Modal.Header>
                    <Modal.Title>Thông tin tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="avatar">
                            <div style={{
                                width: '100px',
                                height: '100px',
                                margin: '0px auto'
                            }}>
                                <input style={{ display: 'none' }} id='file' type='file' accept='image/*' onChange={handleChangeImage} />
                                <label htmlFor="file" className='avatar-img'>
                                    <img src={image?.preview || User?.avatar} alt="avt" />
                                </label>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                disabled={true}
                                value={User?.email}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Tên hiển thị</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nguyen Van A"
                                autoFocus
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setDisabled(false);
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" disabled={disabled} onClick={handleUploadProfile}>
                        Xác Nhận Thay Đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </>
    );

}
