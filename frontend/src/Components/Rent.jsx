import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Input, Typography, Col, Row, Select } from 'antd';
import CardFlat from './CardFlat.jsx';

const { Link } = Typography;

const RentWrapper = styled.div`
  flex: 1; /* Растягиваем на всю высоту */
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const { Search } = Input;

const RentLink = styled(Link)`
  font-size: 30px;
  margin: 20px auto;
`;

const NoResults = styled.div`
  text-align: center;
  color: #fff;
  font-size: 18px;
  padding: 20px;
  font-style: italic;
`;

const WrapperSearch = styled.div`
  margin-bottom: 30px;
  padding-right: 650px;
`;

const RentContainer = styled.div`
  height: 100%;
`;

const RentBackImg = styled.div`
  height: 520px;
  background-image: url('/images/MainPhoto.jpg');
  background-size: 100% 150%;
  background-repeat: no-repeat;
`;

const RentTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 36px;
  text-align: center;
  color: #696969;
  text-shadow: 3px 3px 3px white;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #fff;
  font-size: 36px;
  padding: 50px;
  font-style: italic;
`;
const JsonDisplay = styled.pre``;

function Rent() {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
    const [roomCount, setRoomCount] = useState('');

  useEffect(() => {
    const fetchRent = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Rent.jsx: Запрос к /find_flats/rents');
        const response = await axios.get(
          'http://0.0.0.0:8000/find_flats/rents',
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Expires': '0',
              'Pragma': 'no-cache',
              'Access-Control-Allow-Origin': 'http://0.0.0.0:8000',
            },
            validateStatus: (status) =>
              (status >= 200 && status < 300) || status === 304,
            timeout: 5000,
          }
        );
        console.log('Rent.jsx: Ответ сервера:', response.status, response.data);
        setRent(response.data);
      } catch (e) {
        console.error('Rent.jsx: Ошибка при получении данных:', e);
        setError(
          'Ошибка при загрузке данных об аренде. Пожалуйста, попробуйте позже.'
        );
        setRent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRent();
  }, []);

  const handleSearch = (value) => {
    console.log('handleSearch вызвана', value);
    setSearchTerm(value);
    let results = [];
    if (value) {
      results = rent.filter((item) => {
        let streetMatch = true;
        let roomCountMatch = true;

        //  Проверка соответствия по улице
        if (value) {
          if (item.location && typeof item.location === 'string') {
            const locationParts = item.location.split(',');
            const street = locationParts[1]
              ? locationParts[1].trim().toLowerCase()
              : '';
            const term = value.toLowerCase().trim();
            streetMatch = street.includes(term);
          } else {
            streetMatch = false;
          }
        }

        //  Проверка соответствия по количеству комнат
        if (roomCount) {
          roomCountMatch = String(item.room_count) === roomCount;
        }

        return streetMatch && roomCountMatch;
      });
    }
    setSearchResults(results);
  };

  if (loading) {
    return (
      <RentWrapper>
        <RentTitle>Загрузка данных об аренде...</RentTitle>
      </RentWrapper>
    );
  }

  if (error) {
    return (
      <RentWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </RentWrapper>
    );
  }

  const itemsToDisplay = searchTerm ? searchResults : rent;
  const noResults = searchTerm && itemsToDisplay.length === 0;

  return (
    <RentWrapper>
      <RentBackImg>
        <RentTitle>Поиск аренды в Перми</RentTitle>
        <WrapperSearch>
          <Search
            placeholder="Введите адрес для поиска"
            allowClear
            enterButton="Найти"
            size="large"
            onSearch={handleSearch}
          />
            <Select
              placeholder="Количество комнат"
              onChange={(value) => setRoomCount(value)}
              style={{ width: 200, marginRight: 16 }}
              allowClear
            >
              <Select.Option value="Однокомнатная">Однокомнатная</Select.Option>
              <Select.Option value="Двухкомнатная">Двухкомнатная</Select.Option>
              <Select.Option value="Трехкомнатная">Трехкомнатная</Select.Option>
              <Select.Option value="Четырехкомнатная">Четырехкомнатная</Select.Option>
            </Select>
        </WrapperSearch>
      </RentBackImg>
      <RentContainer>
        {noResults ? (
          <NoResults>По вашему запросу ничего не найдено.</NoResults>
        ) : (
          <Row gutter={16}>
            {itemsToDisplay.map((rent, i) => (
              <CardFlat key={i} flat={rent} url_flat="find_flats/rents" />
            ))}
          </Row>
        )}
      </RentContainer>
    </RentWrapper>
  );
}

export default Rent;