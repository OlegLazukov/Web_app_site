import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CardFlatById from './CardFlatById';

const FlatRentWrapper = styled.div`
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

const FlatRentContainer = styled.div`
  height: 1000px;
  overflow-y: auto;
`;

const FlatRentTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
    color: #696969;
    text-shadow: 3px 3px 3px white;
`;

const FlatRentItem = styled.li`
  margin-bottom: 10px;
  font-size: 24px;
  padding: 40px;
  color: #fff;
  text-align: center;
  width: 100%;
  font-style: italic;
`;

function FlatRent() {
  const { uuid } = useParams();
  console.log('UUID из параметров:', uuid);
  const [flatRent, setFlatRent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchRent = async () => {
      setLoading(true);
      try {
        console.log(`Flat.jsx: Запрос к /find_flats/rents/${uuid}`);
        const response = await axios.get(
          `http://http://155.212.147.208/api/find_flats/rents/${uuid}`,
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
        setFlatRent(response.data);
        setError(null); // Сброс ошибки при успешной загрузке
      } catch (e) {
        console.error('Flat.jsx: Ошибка при получении данных:', e);
        setError(
          'Ошибка при загрузке данных о квартире. Пожалуйста, попробуйте позже.'
        );
        setFlatRent(null); // Сброс данных о квартире при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchRent();
  }, [uuid]);

  useEffect(() => {
  if (flatRent) {
    console.log('flat:', flatRent, 'property_type:', typeof flatRent.property_type, 'room_count:', typeof flatRent.room_count);
    const room_count = propertyTypeRoomCount[flatRent.room_count];
    const property_type = flatRent.property_type
    if (
      typeof property_type === "string" &&
      property_type.length > 0 &&
      (typeof room_count === "number" || !isNaN(Number(room_count)))
    ) {
      axios.get(
        `http://0.0.0.0:8000/api/data/images?property_type=${encodeURIComponent(property_type)}&room_count=${Number(room_count)}`
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
  }, [flatRent]);

  if (loading) {
    return (
      <FlatRentWrapper>
        <FlatRentTitle>Загрузка данных о квартире...</FlatRentTitle>
      </FlatRentWrapper>
    );
  }

  if (error) {
    return (
      <FlatRentWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </FlatRentWrapper>
    );
  }

  if (!flatRent) {
    return (
      <FlatRentWrapper>
        <ErrorMessage>Квартира не найдена.</ErrorMessage>
      </FlatRentWrapper>
    );
  }

  return (
    <FlatRentWrapper>
      <FlatRentContainer>
          <CardFlatById flat={flatRent} imageUrls={imageUrls}/>
      </FlatRentContainer>
    </FlatRentWrapper>
  );
}

export default FlatRent;