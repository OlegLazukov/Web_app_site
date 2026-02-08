import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f0f0f0;
  padding: 15px 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
  border-top: 1px solid #ddd;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  @media (max-width: 768px) {
    position: static;
    font-size: 0.8rem;
    padding: 10px;
  }
`;

const FooterLink = styled.a`
  color: inherit;
  margin: 0 10px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
    @media (max-width: 768px) {
    display: block;    /* Каждая ссылка на новой строке */
    margin: 5px auto; /* Центрируем ссылки и добавляем отступы сверху и снизу */
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      © 2025 ООО «Моя Компания». Все права защищены.
      <br />
      <FooterLink href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">
        Политика конфиденциальности
      </FooterLink>
      |
      <FooterLink href="https://example.com/terms" target="_blank" rel="noopener noreferrer">
        Условия использования
      </FooterLink>
    </FooterContainer>
  );
}