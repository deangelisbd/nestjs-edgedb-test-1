import React, { useState, useEffect } from 'react'
import { Canvas, NodeData, EdgeData } from 'reaflow'
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { Client } from '../App'

export function SchemaCanvas(props:Client) {

  const [nodes, setNodes] = useState<NodeData[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([]);

  useEffect(() => {
    props.client.get((process.env.REACT_APP_NESTJS_EDGEQL_QUERY_ENDPOINT || '/') + '?query=' + encodeURIComponent("select name := schema::ObjectType.name filter name like 'default::%';"))
                .then((res) => {
                  let data:NodeData[] = [];
                  for(let i=0; i<res.data.length; i++) {
                    let name = res.data[i].substring('default::'.length)
                    let node = { id: name, text: name }
                    data.push(node);
                  }
                  setNodes(data);
                })
  }, []);


  return (
    <Canvas
      nodes={nodes}
      edges={edges}
    />
  );
}