import './App.css'
import { Image, Alert, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const baseURL='http://localhost:5000/api/todoitems';
//const axios = require('axios')

const App = () => {
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])
  const [renderAlert,setRenderAlert] = useState('')
  

  useEffect(() => {
    // todo
     getItems();
  }, [])

  const renderAddTodoItemContent = () => {
    return (
      <Container>
        <h1>Add Item</h1>
        <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
          <Form.Label column sm="2">
            Description
          </Form.Label>
          <Col md="6">
            <Form.Control
              type="text"
              placeholder="Enter description..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </Col>
        </Form.Group>
        
       {renderAlert}
  
        <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
          <Stack direction="horizontal" gap={2}>
            <Button variant="primary" onClick={() => handleAdd()}>
              Add Item
            </Button>
            <Button variant="secondary" onClick={() => handleClear()}>
              Clear
            </Button>
          </Stack>
        </Form.Group>
      </Container>
    )
  }
  
  const renderTodoItemsContent = () => {
    return (
      <>
        <h1>
          Showing {items.length} Item(s){' '}
          <Button variant="primary" className="pull-right" onClick={() => getItems()}>
            Refresh
          </Button>
        </h1>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
                    Mark as completed
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }


  const handleDescriptionChange = (event) => {
    // todo
    setDescription(event.target.value);
  }

  async function getItems() {
    try {
      //alert('todo')
      axios.get(baseURL).then((response) => {
        setItems(response.data);
      });
    } catch (error) {
      console.error(error)
    }
  }

  async function handleAdd() {
    try {
      //alert('todo')
      var uuid=generateUUID();
      //console.log(uuid);
      axios.post( baseURL, {"Id": uuid,"Description": description,"IsCompleted": false} )
      .then( (response)=>{
        //console.log(response);
        getItems();
      })
      .catch((error)=>{
        //console.log(error);
        setRenderAlert(myAlert('danger',error.response.data));
      });
    } catch (error) {
      console.error(error)
    }
  }

  function myAlert(alertType,Message) {
    return (
      <Alert variant={alertType} onClose={() => setRenderAlert('')}  dismissible>
        <p>
          {Message}
       </p>
      </Alert>
    )
  }

  function handleClear() {
    setDescription('')
  }

  function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }


  async function handleMarkAsComplete(item) {
    try {
      //alert('todo')
      const putURL = `${baseURL}/${item.id}`;
      //console.log(putURL);
      //console.log(item);
      const todoItem= { "id": `${item.id}`, "Description": `${item.description}`, "IsCompleted":true};
      axios.put(putURL, todoItem)
      .then((response)=>{
        console.log(response);
        if(response.status==204)
        setRenderAlert(myAlert('primary','Task Completed: '+item.description));
        getItems();
      });
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Todo List App</Alert.Heading>
              Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean so your
              task(s) are as follows:
              <br />
              <br />
              <ol className="list-left">
                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                <li>
                  Display (GET) all the current Todo Items in the below grid and display them in any order you wish
                </li>
                <li>
                  Bonus points for completing the 'Mark as completed' button code for allowing users to update and mark
                  a specific Todo Item as completed and for displaying any relevant validation errors/ messages from the
                  API in the UI
                </li>
                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
              </ol>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>{renderAddTodoItemContent()}</Col>
        </Row>
        <br />
        <Row>
          <Col>{renderTodoItemsContent()}</Col>
        </Row>
      </Container>
      <footer className="page-footer font-small teal pt-4">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
            clearpoint.digital
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
