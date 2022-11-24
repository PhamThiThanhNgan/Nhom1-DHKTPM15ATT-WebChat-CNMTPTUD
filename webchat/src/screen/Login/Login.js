import React, { useState } from 'react';
import "../Login/Login.scss";
import imageLogin from "../../asset/image/9814.jpg";
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { login, saveToken } from '../../service/AuthService';
import { useUserStore } from '../../store/store';

function Login() {

  const navigate = useNavigate();
  const [validate, setValidate] = useState('');
  const updateUser = useUserStore(state => state.updateUser);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Email không đúng định dạng'
      ),
    password: Yup.string()
      .required('Vui lòng không bỏ trống!'),
  })

  const handleLogin = (values) => {
    login(values)
      .then((response) => {
        saveToken(response?.data?.data?.accessToken);
        updateUser(response?.data?.data);
        navigate('/');
      })
      .catch((err) => {
        setValidate(err?.response?.data?.message);
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
            <h2 className="title-form">Đăng nhập</h2>
            <Formik
              validationSchema={validationSchema}
              onSubmit={handleLogin}
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
                  <Form.Group className="mb-3">
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
                  <Form.Group className="mb-3">
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
                    {validate && (
                      <p className="error-message text-center mt-2">
                        {validate}
                      </p>
                    )}
                  </Form.Group>
                  <div className="text-center">
                    <Button className='mb-3 w-100' variant="primary" type="submit">
                      Đăng nhập
                    </Button>
                  </div>
                  <Form.Group className='section-3 text-center'>
                    <Form.Label className='section-4'>Bạn chưa có tài khoản? &nbsp;
                      <Link to='/register' className='dk' >Đăng kí </Link> </Form.Label>
                  </Form.Group>
                  <Form.Group className='section-3 text-center'>
                  <Form.Label className='section-4'>
                      <Link to='/forgot-password' className='dk' >Quên mật khẩu </Link>
                  </Form.Label>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default Login;
