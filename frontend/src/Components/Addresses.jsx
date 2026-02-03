import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CardContactsOrAddresses from './CardContactsOrAddresses.jsx';
import { Col, Row } from 'antd';

const AddressesWrapper = styled.div`
    margin: 0px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-image: url('/images/back_photo.jpg');
    background-size: cover;
    background-repeat: no-repeat;
`;



const AddressContainer = styled.div`
  height: 100%;
`;

const AddressTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
    color: #696969;
    text-shadow: 3px 3px 3px white;
`;

const AddressList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AddressItem = styled.li`
  margin-bottom: 10px;
  font-size: 24px;
  padding: 40px;
  color: #fff;
  text-align: center;
  width: 100%;
  font-style: italic;
`;

function Addresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        console.log('Addresses.jsx: Запрос к /addresses');
        const response = await axios.get('/api/addresses', {
          headers: {
            'Cache-Control': 'no-cache',
            'Expires': '0',
            'Pragma': 'no-cache',
            'Access-Control-Allow-Origin': 'http://155.212.147.208:8000',
          },
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 304,
          timeout: 5000,
        });
        console.log(
          'Addresses.jsx: Ответ сервера:',
          response.status,
          response.data
        );

        setAddresses(response.data);
      } catch (error) {
        console.error('Addresses.jsx: Ошибка при получении адресов:', error);
        setAddresses(['Ошибка загрузки контактов']);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <AddressesWrapper>
            <AddressContainer>
                <AddressTitle>Нас можно найти:</AddressTitle>
                <AddressList>
                  {Array.isArray(addresses) ? (
                    <Row gutter={16}>
                      {addresses.map((address, idx) => (
                        <CardContactsOrAddresses key={idx} info={address} mainTitle="По адресу" />
                      ))}
                    </Row>
                  ) : (
                    <AddressItem>Ошибка загрузки адресов</AddressItem>
                  )}
                </AddressList>
            </AddressContainer>
    </AddressesWrapper>
  );
}

export default Addresses;