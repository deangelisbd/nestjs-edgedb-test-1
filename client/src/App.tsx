import './App.css';
import 'antd/dist/antd.min.css';
import React, { useState } from 'react'
import { Input, PageHeader, Button,Card } from 'antd';
import axios from 'axios';
import { AxiosInstance } from 'axios'
import { SchemaCanvas } from './SchemaCanvas/SchemaCanvas'

export type Client = {
  client: AxiosInstance
}

function App() {

  const [edgeQLQueryString, setEdgeQLQueryString] = useState('')
  const [edgeQLQueryResult, setEdgeQLQueryResult] = useState('')

  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_NESTJS_BASE_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  axiosClient.interceptors.response.use(
    function (response) {
      return response;
    }, 
    function (error) {
      let res = error.response;
      console.error('Looks like there was a problem. Status Code: ' + res.status);
      return Promise.reject(error);
    }
  );
  
  const executeEdgeQLQuery = () => {
    axiosClient.get((process.env.REACT_APP_NESTJS_EDGEQL_QUERY_ENDPOINT || '/') + '?query=' + encodeURIComponent(edgeQLQueryString))
                .then((res) => {
                  setEdgeQLQueryResult(JSON.stringify(res.data,null,2))
                })
    
  }

  const schemaCanvasProps = {
    client: axiosClient
  }

  return (
    <div className="App">
      <PageHeader
        className="site-page-header"
        title="Edge Query Builder"
      />
      <Input placeholder="Enter EdgeQL" style={{ width:'250px', display:'inline-block' }} onChange={(e) => setEdgeQLQueryString(e.target.value)}/> 
      <Button onClick={executeEdgeQLQuery}>Execute</Button>
      <Card><pre>{ edgeQLQueryResult }</pre></Card>
      <SchemaCanvas {...schemaCanvasProps}></SchemaCanvas>
    </div>
  );

}

export default App;
