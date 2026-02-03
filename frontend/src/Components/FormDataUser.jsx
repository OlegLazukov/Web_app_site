import React from 'react';
import { Button, Form, Input, message } from 'antd';
import styled from 'styled-components';
import axios from 'axios';

const Title = styled.h2`
    text-align: center;
    font-size: 24px;
    margin-bottom: 30px;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 12px;
  label {
    font-size: 20px !important;
  }
`;

const StyledInput = styled(Input)`
  font-size: 18px;
  padding: 8px;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
`;

const FormDataUser = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await axios.post(
              '/api/user_data',
              {
                lastname_user: values.lastname_user,
                username: values.username,
                middlename_user: values.middlename_user,
                number_user: values.number_user,
                email: values.email_user,
              },
              {
                headers: {
                  'Cache-Control': 'no-cache',
                  'Expires': '0',
                  'Pragma': 'no-cache',
//                   'Access-Control-Allow-Origin': 'http://0.0.0.0:8000',
                },
              }
            );

            console.log('Успешно:', response.data);
            message.success('Заявка успешно отправлена!');
            form.resetFields();
        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Не удалось отправить:', errorInfo);
        message.error('Пожалуйста, заполните все обязательные поля.');
    };

    return (
        <Form
            form={form}
            name="wrap"
            labelCol={{ flex: '110px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            layout="horizontal"
            colon={false}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Title>Предлагаем оставить заявку на консультацию со специалистом</Title>
            <StyledFormItem label="Фамилия" name="lastname_user" rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию!' }]}>
                <StyledInput placeholder="Введите вашу фамилию" />
            </StyledFormItem>

            <StyledFormItem label="Имя" name="username" rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}>
                <StyledInput placeholder="Введите ваше имя" />
            </StyledFormItem>

            <StyledFormItem label="Отчество" name="middlename_user" rules={[{ required: true, message: 'Пожалуйста, введите ваше отчество!' }]}>
                <StyledInput placeholder="Введите ваше отчество" />
            </StyledFormItem>

            <StyledFormItem label="Телефон" name="number_user" rules={[{ required: true, message: 'Пожалуйста, введите ваш номер телефона!' }]}>
                <StyledInput placeholder="Введите ваш номер телефона" />
            </StyledFormItem>

            <StyledFormItem label="Email" name="email_user">
                <StyledInput placeholder="Введите ваш email" />
            </StyledFormItem>

            <StyledFormItem label=" ">
                <StyledButton type="primary" htmlType="submit">
                    Оставьте заявку
                </StyledButton>
            </StyledFormItem>
        </Form>
    );
};

export default FormDataUser;