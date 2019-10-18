import React, { Component } from 'react';

import { Button, Col, Row, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textinput: '',
      sentiment: '',
      wordObject: null,
      isLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
  }

  handleOnchange(event) {
    this.setState({ [event.target.name]: event.target.value, errors: {} });
  }

  handleSubmit() {
    if (this.state.textinput === '') {
      return;
    }
    this.setState({ isLoading: true });
    this.getSentiment();

    let tempMarkers = {};
    let textarray = this.state.textinput.split(' ');
    tempMarkers = textarray.reduce(function(result, item) {
      result[item + ''] = result[item + ''] || {};
      let tempPbj = result[item + ''];
      tempPbj.count = tempPbj.count || 0;
      tempPbj.count++;
      return result;
    }, {});

    const result = [];

    Object.keys(tempMarkers).forEach(key => {
      result.push({
        text: key,
        value:
          tempMarkers[key].count *
          Math.floor(Math.random(50) * Math.floor(tempMarkers[key].count * 100))
      });
    });
    console.log('result', result);
    this.setState({ wordObject: result });
  }

  getSentiment() {
    this.setState({ sentiment: 'Loading Sentiment Analysis...' });
    var bodyFormData = new FormData();
    bodyFormData.set('text', this.state.textinput);
    axios({
      method: 'POST',
      url: `http://localhost:5000/getSentiment`,
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(res => {
        console.log('result', res);
        this.setState({ isLoading: false, sentiment: 'Analysis result is ' + res.data });
      })
      .catch(error => {
        console.log('Error in getting analysis result', error);
        this.setState({ isLoading: false });
      });
  }

  render() {
    let content = '';
    let resultContent = '';

    if (!this.state.isLoading && this.state.sentiment !== '') {
      resultContent = (
        <Col className="text-center py-5">
          <h4>{this.state.sentiment}</h4>
        </Col>
      );
    }
    content = (
      <Col className="content" md="12">
        <Row>
          <Col md="3"></Col>
          <Col md="6">
            <FormGroup>
              <Label for="exampleText">
                <h4>Enter your text</h4>
              </Label>
              <Input
                onChange={this.handleOnchange}
                rows="6"
                cols="50"
                type="textarea"
                name="textinput"
                id="textinput"
              />
            </FormGroup>
          </Col>
          <Col md="3"></Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button
              style={{ width: '12em' }}
              onClick={() => {
                this.handleSubmit();
              }}
              color="primary"
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          </Col>
        </Row>
      </Col>
    );

    return (
      <div>
        <Row style={{ minHeight: '40vh' }}>{content}</Row>
        <Row style={{ minHeight: '10vh' }}>{resultContent}</Row>
        <Row style={{ minHeight: '20vh' }}>
          <Col>
            {this.state.wordObject !== null ? <ReactWordcloud words={this.state.wordObject} /> : ''}
          </Col>
        </Row>
      </div>
    );
  }
}
