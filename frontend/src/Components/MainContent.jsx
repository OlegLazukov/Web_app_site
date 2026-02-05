import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Typography, Col, Row, Select } from 'antd';
import CardFlat from './CardFlat.jsx';

const { Search } = Input;
const { Link } = Typography;

const MainContentWrapper = styled.div`
  margin: 0px;
`;

const MainBackImg = styled.div`
  height: 520px;
  background-image: url('/images/MainPhoto.jpg');
  background-size: 100% 150%;
  background-repeat: no-repeat;
`;

const MainContentTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 36px;
  text-align: center;
  color: #696969;
  text-shadow: 3px 3px 3px white;
`;

const WrapperSearch = styled.div`
  margin-bottom: 30px;
  padding-right: 650px;
`;

const NoResults = styled.div`
  text-align: center;
  color: #000;
  font-size: 18px;
  padding: 20px;
  font-style: italic;
`;

const LoadTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 36px;
  text-align: center;
  color: #696969;
  text-shadow: 3px 3px 3px white;
`;

const MainContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export default function MainContent({ flats, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [roomCount, setRoomCount] = useState('');

  const handleSearch = (value) => {
    console.log('handleSearch вызвана', value);
    setSearchTerm(value);

    let results = flats.filter((item) => {
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

    setSearchResults(results);
  };

  if (loading) return <LoadTitle>Загрузка всей недвижимости в Перми…</LoadTitle>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!flats.length) return <p>Квартир не найдено</p>;

  const itemsToDisplay = searchTerm ? searchResults : flats;
  const noResults = searchTerm && itemsToDisplay.length === 0;

  return (
    <MainContentWrapper>
      <MainBackImg>
        <MainContentTitle>Поиск недвижимости в Перми</MainContentTitle>
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
      </MainBackImg>
      <MainContentContainer>
        {noResults ? (
          <NoResults>По вашему запросу ничего не найдено.</NoResults>
        ) : (
          <Row gutter={16}>
            {itemsToDisplay.map((flat, i) => (
              <CardFlat key={i} flat={flat} url_flat="find_flats" />
            ))}
          </Row>
        )}
      </MainContentContainer>
    </MainContentWrapper>
  );
}