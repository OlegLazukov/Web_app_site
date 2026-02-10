import React from 'react';
import { Card, Col } from 'antd';
import styled from 'styled-components';
// import { Typography } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

// const { Link } = Typography;

const FlatInfo = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

const StyledCard = styled(Card)`
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 389px;
`;


const MainLink = styled(RouterLink)`
  font-size: 30px;
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CardFlat = ({ flat, url_flat }) => (

  <Col span={12}>
      <StyledCard>
        <Card title={
          <MainLink
            to={`/${url_flat}/${flat.id}`}
          >
            {flat.room_count} квартира {flat.square} м²
          </MainLink>
        } variant="borderless">
          <FlatInfo>Цена: {flat.price} руб. {flat.price < 1000000 ? "в месяц" : ""}</FlatInfo>
          <FlatInfo>Площадь: {flat.square} м².</FlatInfo>
          <FlatInfo>Местоположение: {flat.location}</FlatInfo>
        </Card>
      </StyledCard>
  </Col>
);

export default CardFlat;