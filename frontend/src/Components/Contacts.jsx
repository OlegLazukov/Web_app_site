import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CardContactsOrAddresses from './CardContactsOrAddresses.jsx';
import { Col, Row } from 'antd';


const ContactWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: url("/images/back_photo.jpg");
  background-size: cover;
  background-repeat: no-repeat;
`;


const ContactContainer = styled.div`
  height: 100%;
`;

const ContactTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
    color: #696969;
    text-shadow: 3px 3px 3px white;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const ContactItem = styled.li`
  margin-bottom: 10px;
  font-size: 24px;
  padding: 40px;
  color: #fff;
  text-align: center;
  width: 100%;
  font-style: italic;
`;


function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log('Contacts.jsx: Запрос к /contacts');
        const response = await axios.get(
          '/api/contacts',
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Expires': '0',
              'Pragma': 'no-cache',
              'Access-Control-Allow-Origin': 'http://155.212.147.208:8000'
            },
            // считаем 304 «успешным»
            validateStatus: status =>
              (status >= 200 && status < 300) || status === 304,
            timeout: 5000
          }
        );
        console.log('Contacts.jsx: Ответ сервера:', response.status, response.data);

        // response.data гарантированно массив (или пустой)
        setContacts(response.data);
      } catch (error) {
        console.error('Contacts.jsx: Ошибка при получении контактов:', error);
        setContacts(['Ошибка загрузки контактов']);
      }
    };

    fetchContacts();
  }, []);

  return (
      <ContactWrapper>
        <ContactContainer>
          <ContactTitle>Контакты наших специалистов:</ContactTitle>
          <ContactList>
            {Array.isArray(contacts) ? (
              <Row gutter={16}>
                {contacts.map((contacts, idx) => (
                  <CardContactsOrAddresses key={idx} info={contacts} mainTitle="Специалист по недвижимости" />
                ))}
              </Row>
            ) : (
              <ContactItem>Ошибка загрузки контактов</ContactItem>
            )}
          </ContactList>
        </ContactContainer>
      </ContactWrapper>
  );
}

export default Contacts;