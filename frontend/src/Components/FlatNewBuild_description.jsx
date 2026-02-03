import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CardFlatById from './CardFlatById';

const FlatNewBuildWrapper = styled.div`
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

const FlatNewBuildContainer = styled.div`
  height: 1000px;
  overflow-y: auto;
`;

const FlatNewBuildTitle = styled.h2`
  text-align: center;
  color: #fff;
  font-size: 36px;
  padding: 50px;
  font-style: italic;
`;

const FlatNewBuildItem = styled.li`
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
    color: #696969;
    text-shadow: 3px 3px 3px white;
`;

function FlatNewBuild() {
  const { uuid } = useParams();
  console.log('UUID из параметров:', uuid);
  const [flatNewBuild, setFlatNewBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchNewBuild = async () => {
      setLoading(true);
      try {
        console.log(`Flat.jsx: Запрос к /find_flats/news_buildings/${uuid}`);
        const response = await axios.get(
          `/api/find_flats/news_buildings/${uuid}`,
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
          'Flat.jsx: Ответ сервера:',
          response.status,
          response.data
        );
        setFlatNewBuild(response.data);
        setError(null); // Сброс ошибки при успешной загрузке
      } catch (e) {
        console.error('Flat.jsx: Ошибка при получении данных:', e);
        setError(
          'Ошибка при загрузке данных о квартире. Пожалуйста, попробуйте позже.'
        );
        setFlatNewBuild(null); // Сброс данных о квартире при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchNewBuild();
  }, [uuid]);

  useEffect(() => {
  if (flatNewBuild) {
    console.log('flat:', flatNewBuild, 'property_type:', typeof flatNewBuild.property_type, 'room_count:', typeof flatNewBuild.room_count);
    const room_count = propertyTypeRoomCount[flatNewBuild.room_count];
    const property_type = flatNewBuild.property_type
    if (
      typeof property_type === "string" &&
      property_type.length > 0 &&
      (typeof room_count === "number" || !isNaN(Number(room_count)))
    ) {
      axios.get(
        `/api/data/images?property_type=${encodeURIComponent(property_type)}&room_count=${Number(room_count)}`
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
  }, [flatNewBuild]);

  if (loading) {
    return (
      <FlatNewBuildWrapper>
        <FlatNewBuildTitle>Загрузка данных о квартире...</FlatNewBuildTitle>
      </FlatNewBuildWrapper>
    );
  }

  if (error) {
    return (
      <FlatNewBuildWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </FlatNewBuildWrapper>
    );
  }

  if (!flatNewBuild) {
    return (
      <FlatNewBuildWrapper>
        <ErrorMessage>Квартира не найдена.</ErrorMessage>
      </FlatNewBuildWrapper>
    );
  }

  return (
    <FlatNewBuildWrapper>
      <FlatNewBuildContainer>
         <CardFlatById flat={flatNewBuild} imageUrls={imageUrls}/>
      </FlatNewBuildContainer>
    </FlatNewBuildWrapper>
  );
}

export default FlatNewBuild;