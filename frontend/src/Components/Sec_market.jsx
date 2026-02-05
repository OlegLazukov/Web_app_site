import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Input, Typography, Col, Row, Select } from 'antd';
import CardFlat from './CardFlat.jsx';

const { Link } = Typography;

const SecMarketWrapper = styled.div`
  flex: 1; /* Растягиваем на всю высоту */
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const NoResults = styled.div`
  text-align: center;
  color: #fff;
  font-size: 18px;
  padding: 20px;
  font-style: italic;
`;

const SecMarketBackImg = styled.div`
  height: 520px;
  background-image: url('/images/MainPhoto.jpg');
  background-size: 100% 150%;
  background-repeat: no-repeat;
`;

const { Search } = Input;

const SecMarketLink = styled(Link)`
  font-size: 30px;
  margin: 20px auto;
`;

const WrapperSearch = styled.div`
  margin-bottom: 30px;
  padding-right: 650px;
`;

const SecMarketContainer = styled.div`
  height: 100%;
`;

const SecMarketTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 36px;
  text-align: center;
  color: #696969;
  text-shadow: 3px 3px 3px white;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const JsonDisplay = styled.pre`
  /* Ваши стили для JsonDisplay */
`;

function SecMarket() {
  const [secMarket, setSecMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [roomCount, setRoomCount] = useState('');

  useEffect(() => {
    const fetchSecMarket = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('SecMarket.jsx: Запрос к /find_flats/secondary_markets');
        const response = await axios.get(
          '/api/find_flats/secondary_markets',
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Expires': '0',
              'Pragma': 'no-cache',
              'Access-Control-Allow-Origin': 'http://155.212.147.208:8000',
            },
            validateStatus: (status) =>
              (status >= 200 && status < 300) || status === 304,
            timeout: 5000,
          }
        );
        console.log(
          'SecMarket.jsx: Ответ сервера:',
          response.status,
          response.data
        );
        setSecMarket(response.data);
      } catch (e) {
        console.error('SecMarket.jsx: Ошибка при получении данных:', e);
        setError(
          'Ошибка при загрузке данных о вторичном рынке. Пожалуйста, попробуйте позже.'
        );
        setSecMarket([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSecMarket();
  }, []);

  const handleSearch = (value) => {
    console.log('handleSearch вызвана', value);
    setSearchTerm(value);
    let results = []; // Инициализируем results здесь
    if (value) {
      results = secMarket.filter((item) => {
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
      <SecMarketWrapper>
        <SecMarketTitle>Загрузка данных о вторичном рынке...</SecMarketTitle>
      </SecMarketWrapper>
    );
  }

  if (error) {
    return (
      <SecMarketWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </SecMarketWrapper>
    );
  }

  const itemsToDisplay = searchTerm ? searchResults : secMarket;
  const noResults = searchTerm && itemsToDisplay.length === 0;

  return (
    <SecMarketWrapper>
      <SecMarketBackImg>
        <SecMarketTitle>Поиск вторичных квартир в Перми</SecMarketTitle>
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
      </SecMarketBackImg>
      <SecMarketContainer>
        {noResults ? (
          <NoResults>По вашему запросу ничего не найдено.</NoResults>
        ) : (
          <Row gutter={16}>
            {itemsToDisplay.map((secMarket, i) => (
              <CardFlat
                key={i}
                flat={secMarket}
                url_flat="find_flats/secondary_markets"
              />
            ))}
          </Row>
        )}
      </SecMarketContainer>
    </SecMarketWrapper>
  );
}

export default SecMarket;