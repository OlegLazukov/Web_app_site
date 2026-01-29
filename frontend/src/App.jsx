import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import Header from './Components/Header.jsx';
import Footer from './Components/Footer.jsx';
import MainContent from './Components/MainContent.jsx';
import Addresses from './Components/Addresses.jsx';
import Contacts from './Components/Contacts.jsx';
import styled from 'styled-components';
import Rent from './Components/Rent.jsx';
import SecMarket from './Components/Sec_market.jsx';
import NewBuildings from './Components/New_buildings.jsx';
import Flat from './Components/Flat_description.jsx';
import FlatNewBuild from './Components/FlatNewBuild_description.jsx';
import FlatRent from './Components/FlatRent_description.jsx';
import FlatSecMarket from './Components/FlatSecMarket_description.jsx';


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;


function App() {
  const [flats, setFlats]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Загрузка списка квартир
  const fetchFlats = async (query = '') => {
    setLoading(true);
    try {
      console.log(`App.jsx: Запрос к /find_flats${query}`);
      const response = await axios.get(
        `http://0.0.0.0:8000/api/find_flats${query}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Expires': '0',
            'Pragma': 'no-cache',
            'Access-Control-Allow-Origin': 'http://0.0.0.0:8000'
          },
          // считаем 304 «успешным»
          validateStatus: status =>
            (status >= 200 && status < 300) || status === 304,
          timeout: 5000,
        }
      );
      console.log(
        `App.jsx: Ответ /find_flats${query}:`,
        response.status,
        response.data
      );
      // response.data — это всегда массив квартир
      setFlats(response.data);
      setError(null);
    } catch (e) {
      console.error('App.jsx: Ошибка при получении квартир:', e);
      setError('Не удалось загрузить список квартир');
      setFlats([]);
    } finally {
      setLoading(false);
    }
  };

  // при старте загрузим все квартиры
  useEffect(() => {
    fetchFlats();
  }, []);

  return (
    <ConfigProvider>
      <Router>
        <AppContainer>
          <Header onFilter={fetchFlats} />

          <Content>
            <Routes>
              <Route
                path="/"
                element={
                  <MainContent
                    flats={flats}
                    loading={loading}
                    error={error}
                  />
                }
              />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/news_buildings" element={<NewBuildings />} />
              <Route path="/rents" element={<Rent />} />
              <Route path="/sec_markets" element={<SecMarket />} />
              <Route path="/find_flats/:uuid" element={<Flat />} />
              <Route path="/find_flats/news_buildings/:uuid" element={<FlatNewBuild />} />
              <Route path="/find_flats/rents/:uuid" element={<FlatRent />} />
              <Route path="/find_flats/secondary_markets/:uuid" element={<FlatSecMarket />} />
            </Routes>
          </Content>

          <Footer />
        </AppContainer>
      </Router>
    </ConfigProvider>
  );
}

export default App;