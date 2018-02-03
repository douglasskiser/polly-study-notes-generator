import React, {Component} from 'react';
import {Container, Header, Form, Select, Divider, Card, Grid, Dimmer, Loader } from 'semantic-ui-react';
import Audio from './components/audio';
import {API_ENDPOINT} from './config';
import voices from './voices';

import './app.css';

export default class App extends Component {
  state = {voice: '', text: '', posts: [], loading: false};

  componentDidMount () {
    this.setState(() => ({loading: true}));
    fetch(`${API_ENDPOINT}?postId=`, {
      method: 'GET'
    }).then(response => response.json())
      .then(posts => this.setState(() => ({posts, loading: false})))
  }

  render () {
    const postCount = this.state.posts.length;
    return (
      <Container className='app'>
        <Header as='h1'>Polly Study Notes Generator</Header>
        <Form onSubmit={this._handleSubmit}>
          <Form.Field control={Select}
                      onChange={this._handleChange('voice')}
                      options={this._getVoiceOptions()}
                      placeholder='Voice'/>
          <Form.TextArea onChange={this._handleChange('text')}
                         placeholder='Enter your notes for polly...'/>
          <Form.Button>Submit</Form.Button>
        </Form>
        <Divider/>
        <Grid stackable>
          {!!postCount && this._getPostRows().map((row, rowIndex) => (
            <Grid.Row key={rowIndex} columns={4}>
              {row.map((post, columnIndex) => (
                <Grid.Column key={columnIndex}>
                  <Card>
                    <Card.Content>
                      <Card.Header>{post.id} - {post.voice}</Card.Header>
                      <Card.Meta>{post.status}</Card.Meta>
                      <Card.Description>
                        {this._getTextLabel(post.text)}
                        {post.status === 'UPDATED' && (
                          <Audio src={post.url} controls/>
                        )}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid.Row>
          ))}
          {!postCount && (
            <div>No Posts...</div>
          )}
        </Grid>
        {!postCount && this.state.loading && (
          <Dimmer active page >
            <Loader>Loading...</Loader>
          </Dimmer>
        )}
      </Container>
    );
  }

  _handleChange = name => (ignore, {value}) => {
    this.setState(() => ({[name]: value}));
  };

  _handleSubmit = () => {
    const {voice, text} = this.state;

    fetch(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({voice, text})
    });
  };

  _getVoiceOptions = () => {
    return voices.map(voice => ({
      key: voice.key,
      value: voice.key,
      text: voice.value
    }))
  };

  _getTextLabel = (text = '') => {
    return text.length >= 250
      ? text.substr(0, 248) + '...'
      : text;
  };

  _getPostRows = () => {
    const {posts} = this.state;
    return posts.length
      ? posts.reduce((rows, post) => {
        if (rows[rows.length - 1].length > 3) {
          return [...rows, [post]];
        }
        rows[rows.length - 1].push(post);
        return rows;
      }, [[]])
      : [];
  };
}
