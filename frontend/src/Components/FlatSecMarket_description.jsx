import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CardFlatById from './CardFlatById';

const FlatSecMarketWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const propertyTypeRoomCount = {
  'Однокомнатная': 1,
  'Двухкомнатная': 2,
  'Трехкомнатная': 3,
  'Четырехкомнатная': 4
};

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const FlatSecMarketContainer = styled.div`
  height: 1000px;
  overflow-y: auto;
`;

const FlatSecMarketTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
    color: #696969;
    text-shadow: 3px 3px 3px white;
`;

const FlatSecMarketItem = styled.li`
  margin-bottom: 10px;
  font-size: 24px;
  padding: 40px;
  text-align: center;
  width: 100%;
`;

function FlatSecMarket() {
  const { uuid } = useParams();
  console.log('UUID из параметров:', uuid);
  const [flatSecMarket, setFlatSecMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchSecMarket = async () => {
      setLoading(true);
      try {
        console.log(`Flat.jsx: Запрос к /find_flats/secondary_markets/${uuid}`);
        const response = await axios.get(
          `http://0.0.0.0:8000/find_flats/secondary_markets/${uuid}`,
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
        console.log(
          'Flat.jsx: Ответ сервера:',
          response.status,
          response.data
        );
        setFlatSecMarket(response.data);
        setError(null); // Сброс ошибки при успешной загрузке
      } catch (e) {
        console.error('Flat.jsx: Ошибка при получении данных:', e);
        setError(
          'Ошибка при загрузке данных о квартире. Пожалуйста, попробуйте позже.'
        );
        setFlatSecMarket(null); // Сброс данных о квартире при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchSecMarket();
  }, [uuid]);

  useEffect(() => {
  if (flatSecMarket) {
    console.log('flat:', flatSecMarket, 'property_type:', typeof flatSecMarket.property_type, 'room_count:', typeof flatSecMarket.room_count);
    const room_count = propertyTypeRoomCount[flatSecMarket.room_count];
    const property_type = flatSecMarket.property_type
    if (
      typeof property_type === "string" &&
      property_type.length > 0 &&
      (typeof room_count === "number" || !isNaN(Number(room_count)))
    ) {
      axios.get(
        `http://0.0.0.0:8000/data/images?property_type=${encodeURIComponent(property_type)}&room_count=${Number(room_count)}`
      )
      .then(resp => {
        setImageUrls(resp.data);
      })
      .catch(err => {
        setImageUrls([]);
      });
    } else {
      console.warn("Некорректные property_type или room_count", property_type, room_count);
      }
    }
  }, [flatSecMarket]);


  if (loading) {
    return (
      <FlatSecMarketWrapper>
        <FlatSecMarketTitle>Загрузка данных о квартире...</FlatSecMarketTitle>
      </FlatSecMarketWrapper>
    );
  }

  if (error) {
    return (
      <FlatSecMarketWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </FlatSecMarketWrapper>
    );
  }

  if (!flatSecMarket) {
    return (
      <FlatSecMarketWrapper>
        <ErrorMessage>Квартира не найдена.</ErrorMessage>
      </FlatSecMarketWrapper>
    );
  }

  return (
    <FlatSecMarketWrapper>
      <FlatSecMarketContainer>
          <CardFlatById flat={flatSecMarket} imageUrls={imageUrls}/>
      </FlatSecMarketContainer>
    </FlatSecMarketWrapper>
  );
}

export default FlatSecMarket;