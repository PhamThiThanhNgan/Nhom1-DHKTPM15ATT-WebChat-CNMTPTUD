import React, { useState } from 'react';
import "../Login/Login.scss";
import imageLogin from "../../asset/image/9814.jpg";
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { register } from '../../service/AuthService';

const Register = () => {

  const navigate = useNavigate();
  const [registered, setRegistered] = useState('');

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmedPassword: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .min(4, 'Tên phải nhiều hơn 4 kí tự'),
    email: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Email không đúng định dạng'
      ),
    password: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
        "Mật khẩu phải từ 7-19 kí tự bao gồm ít nhất một chữ, một số và một kí tự đặc biệt"
      ),
    confirmedPassword: Yup.string()
      .required("Vui lòng không bỏ trống!")
      .oneOf([Yup.ref("password"), null], "nhập lại mật khẩu không khớp"),
  })

  const handleRegister = (values) => {
    register(values)
      .then((response) => {
        navigate('/login');
      })
      .catch((err) => {
        setRegistered(err.response.data.message);
      })
  }

  return (
    <section className='section'>
      <Row style={{ marginLeft: 0, marginRight: 0, height: '100vh' }} className="justify-content-around align-items-center">
        <Col xs={7}>
          <img src={imageLogin} alt="devlogo" />
        </Col>
        <Col xs={4}>
          <div className="wrap-form px-4">
            <h2 className="title-form">Đăng Ký</h2>
            <Formik
              validationSchema={validationSchema}
              onSubmit={handleRegister}
              initialValues={initialValues}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form className='section-from' onSubmit={handleSubmit}>
                  <Form.Group className="mb-2">
                    <Form.Label> Email </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="email"
                        id='email'
                        name='email'
                        value={values?.email}
                        placeholder="Nhập email của bạn"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched?.email && !errors?.email}
                        isInvalid={!!errors?.email}
                      />
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {errors?.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label> Họ Tên </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        id='username'
                        name='username'
                        value={values.username}
                        placeholder="Nhập tên của bạn"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isValid={touched?.username && !errors?.username}
                        isInvalid={!!errors?.username}
                      />
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {errors?.username}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label> Mật khẩu </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="password"
                        id='password'
                        name='password'
                        value={values.password}
                        placeholder="Nhập mật khẩu"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isValid={touched?.password && !errors?.password}
                        isInvalid={!!errors?.password}
                      />
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {errors?.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label> Nhập lại mật khẩu </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="password"
                        id='confirmedPassword'
                        name='confirmedPassword'
                        value={values.confirmedPassword}
                        placeholder="Nhập lại mật khẩu"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isValid={touched?.confirmedPassword && !errors?.confirmedPassword}
                        isInvalid={!!errors?.confirmedPassword}
                      />
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {errors?.confirmedPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                    {registered && (
                      <p className="error-message text-center">
                        {registered}
                      </p>
                    )}
                  </Form.Group>
                  <div className="text-center">
                    <Button className='mb-3 w-100' variant="primary" type="submit">
                      Xác Nhận
                    </Button>
                  </div>
                  <Form.Group className='section-3 text-center'>
                    <Form.Label className='section-4'>Bạn đã có tài khoản? &nbsp;
                      <Link to='/login' className='dk' >Đăng Nhập </Link> </Form.Label>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </section>
  )
}
export default Register;