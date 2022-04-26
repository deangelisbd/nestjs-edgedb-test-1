import React, { useState, useEffect } from 'react'
import { Canvas, NodeData, EdgeData } from 'reaflow'
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { Client } from '../App'

export function SchemaCanvas(props:Client) {

  const [nodes, setNodes] = useState<NodeData[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([]);

  useEffect(() => {
    props.client.get((process.env.REACT_APP_NESTJS_EDGEQL_QUERY_ENDPOINT || '/') + '?query=' + encodeURIComponent("with module schema select ObjectType { name, abstract, bases: { name }, ancestors: { name }, annotations: { name, @value }, links: { name, cardinality, required, target: { name }, }, properties: { name, cardinality, required, target: { name }, }, constraints: { name }, indexes: { expr }, } filter .name like 'default::%'"))
                .then((res) => {
                  let data:NodeData[] = [];
                  for(let i=0; i<res.data.length; i++) {
                    let name = res.data[i].name.substring('default::'.length)
                    let node = { id: name, text: name }
                    for(let j=1; j<res.data[i].properties.length; j++) {
                      let id = name + '.' + res.data[i].properties[j].name
                      let property = { id: id, text: res.data[i].properties[j].name, parent: name }
                      data.push(property)
                    }
                    for(let j=1; j<res.data[i].links.length; j++) {
                      let id = name + '.' + res.data[i].links[j].name
                      let property = { id: id, text: res.data[i].links[j].name, parent: name }
                      data.push(property)
                    }
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