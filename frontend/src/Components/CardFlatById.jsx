import React from 'react';
import { Card, Image } from 'antd';
import styled from 'styled-components';
import FormDataUser from './FormDataUser.jsx';




const StyledCard = styled(Card)`
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
`;

const StyleTitle = styled.div`
    font-size: 36px;

`;



const CardInfo = styled.p`
  margin-bottom: 5px;
  font-size: 20px;
  padding: 20px;
`;


const ImageAndFormContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-right: 10px;
`;

const FormContainer = styled.div`
  width: 300px;
  padding-right: 10px;
  padding-bottom: 20px;
`;



const CardFlatById = ({ flat, imageUrls }) => {
  if (!flat) {
    return <div>Квартира по данному запросу не найдена.</div>;
  }

  return (
        <StyledCard title={<StyleTitle>{flat.room_count} квартира {flat.square} м²</StyleTitle>} variant="borderless">

              <ImageAndFormContainer>
                <InfoContainer>
                  {imageUrls.map((img, index) => (
                      console.log(img.image_url)
                    <Image
                      key={index}
                      width={300}

                      src={
                        `/images/${img.image_url}`
                      }
                      alt={`Фото квартиры`}
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                    />
                  ))}
                  <CardInfo>Цена: {flat.price} руб. {flat.price < 1000000 ? "в месяц" : ""}</CardInfo>
                  <CardInfo>Площадь: {flat.square} м²</CardInfo>
                  <CardInfo>Местоположение: {flat.location}</CardInfo>
                  <CardInfo>Описание: {flat.specifications}</CardInfo>
                </InfoContainer>
                <FormContainer>
                  <FormDataUser />
                </FormContainer>
              </ImageAndFormContainer>

        </StyledCard>
  );
};

export default CardFlatById;