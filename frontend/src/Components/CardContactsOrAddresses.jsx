import React from 'react';
import { Card, Col } from 'antd';
import styled from 'styled-components';

const FlatInfo = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const StyledCard = styled(Card)`
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 200px;
  font-size: 30px;
`;

const Title = styled.div`
    font-size: 30px;
`;

const CardContactsOrAddresses = ({ info, mainTitle }) => (
  <Col xs={24} sm={12} md={8} lg={6}>
    <StyledCard title={<Title>{mainTitle}</Title>}>
      <FlatInfo>{info}</FlatInfo>
    </StyledCard>
  </Col>
);

export default CardContactsOrAddresses;