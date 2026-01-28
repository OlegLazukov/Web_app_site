import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f0f0f0;
  padding: 15px 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
  border-top: 1px solid #ddd;
  position: fixed; /* Фиксируем футер */
  bottom: 0; /* Прижимаем к низу */
  left: 0; /* Прижимаем к левому краю */
  width: 100%;
`;

const FooterLink = styled.a`
  color: inherit;
  margin: 0 10px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
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