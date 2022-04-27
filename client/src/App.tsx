import './App.css';
import 'antd/dist/antd.min.css';
import React, { useState } from 'react'
import { Input, PageHeader, Button,Card } from 'antd';
import axios from 'axios';
import { AxiosInstance } from 'axios'
import { SchemaCanvas } from './SchemaCanvas/SchemaCanvas'
import CodeEditor from '@uiw/react-textarea-code-editor'
import ReactJson from 'react-json-view'

export type Client = {
  client: AxiosInstance
}

function App() {

  const [edgeQLQueryString, setEdgeQLQueryString] = useState('')
  const [edgeQLQueryResult, setEdgeQLQueryResult] = useState<object>([])

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
                  setEdgeQLQueryResult(res.data)
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
      {/* <Input placeholder="Enter EdgeQL" style={{ width:'250px', display:'inline-block' }} onChange={(e) => setEdgeQLQueryString(e.target.value)}/>  */}
      <CodeEditor
        value={ '' }
        language='graphql'
        placeholder='Please enter EdgeQL'
        onChange={(e) => setEdgeQLQueryString(e.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: '#f5f5f5',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <Button onClick={executeEdgeQLQuery}>Execute</Button>
      <Card><ReactJson quotesOnKeys={ false } enableClipboard={ false } collapsed={ 0 } name="result" src={ edgeQLQueryResult } /></Card>
      <Card><SchemaCanvas {...schemaCanvasProps}></SchemaCanvas></Card>
    </div>
  );

}

export default App;
