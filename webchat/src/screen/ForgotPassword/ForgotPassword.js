import React, { useState } from 'react';
import "../Login/Login.scss";
import imageLogin from "../../asset/image/9814.jpg";
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { forgotPassword } from '../../service/AuthService';

function ForgotPassword() {

  const [validate, setValidate] = useState('');
  const [success, setSuccess] = useState('');

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Email không đúng định dạng'
      ),
  })

  const handleForgotPassword = (values) => {
    forgotPassword(values)
      .then((response) => {
        setSuccess(response?.data?.message);
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
            <h2 className="title-form">Nhận link đổi mật khẩu qua email</h2>
            <Formik
              validationSchema={validationSchema}
              onSubmit={handleForgotPassword}
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
                    {validate && (
                      <p className="error-message text-center mt-2">
                        {validate}
                      </p>
                    )}
                    {success && (
                      <p className="success-message text-center mt-2">
                        {success}
                      </p>
                    )}
                  </Form.Group>
                  <div className="text-center">
                    <Button className='mb-3 w-100' variant="primary" type="submit">
                      Xác nhận
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default ForgotPassword;
