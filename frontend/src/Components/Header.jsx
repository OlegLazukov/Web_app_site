import React from 'react';
import styled from 'styled-components';
import { Dropdown, Space, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';




const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 10px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;


const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 15px;
  border-radius: 5px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;


const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  &:hover { color: #007bff; }
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 5px;
  }
`;

export default function Header({ onFilter }) {
  const items = [
    {
      key: 'news',
      label: (
        <Link to="/news_buildings" style={{ textDecoration: 'none', color: 'inherit' }}>
          Новостройки
        </Link>
      ),
    },
    {
      key: 'rents',
      label: (
        <Link to="/rents" style={{ textDecoration: 'none', color: 'inherit' }}>
          Аренда
        </Link>
      ),
    },
    {
      key: 'sec',
      label: (
        <Link to="/sec_markets" style={{ textDecoration: 'none', color: 'inherit' }}>
          Вторичный рынок
        </Link>
      ),
    },
  ];


  return (
    <HeaderContainer>
      <NavButton>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Главная
        </Link>
      </NavButton>

      <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']} >
        <NavButton onClick={e => e.preventDefault()}>
          <Space>
            Найти квартиру <DownOutlined />
          </Space>
        </NavButton>
      </Dropdown>

      <NavButton>
        <Link to="/addresses" style={{ textDecoration: 'none', color: 'inherit' }}>
          Адреса компании
        </Link>
      </NavButton>

      <NavButton>
        <Link to="/contacts" style={{ textDecoration: 'none', color: 'inherit' }}>
          Контакты
        </Link>
      </NavButton>
    </HeaderContainer>
  );
}
