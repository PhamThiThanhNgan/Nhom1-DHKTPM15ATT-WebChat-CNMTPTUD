import React, { useState } from 'react';
import "../Login/Login.scss";
import imageLogin from "../../asset/image/9814.jpg";
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { recoveryPassword} from '../../service/AuthService';

function ResetPassword() {

  const navigate = useNavigate();
  const { id, token } = useParams();
    
  const [validate, setValidate] = useState('');

  const initialValues = {
      password: '',
      confirmedPassword: ''
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Vui lòng không bỏ trống!')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
        "Mật khẩu phải từ 7-19 kí tự bao gồm ít nhất một chữ, một số và một kí tự đặc biệt"
      ),
    confirmedPassword: Yup.string()
      .required("Vui lòng không bỏ trống!")
      .oneOf([Yup.ref("password"), null], "nhập lại mật khẩu không khớp"),
  })

  const handleResetPassword = (values) => {
      recoveryPassword(values, id, token)
        .then((response) => {
            navigate('/login');
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
            <h2 className="title-form">Nhập mật khẩu mới</h2>
            <Formik
              validationSchema={validationSchema}
              onSubmit={handleResetPassword}
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
                    <Form.Label> Mật khẩu </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="password"
                        id='password'
                        name='password'
                        value={values.password}
                        placeholder="Nhập mật khẩu mới"
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

export default ResetPassword;
