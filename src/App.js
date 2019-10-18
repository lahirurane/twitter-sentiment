import React from 'react';
import './App.css';
import Landing from './components/Landing';
import { Col, Row } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Col md="12">
        <Row>
          <Col className="text-center py-5">
            <h1>Twiter Sentiment Analysis</h1>
          </Col>
        </Row>
      </Col>
      <Landing />
    </div>
  );
}

export default App;
