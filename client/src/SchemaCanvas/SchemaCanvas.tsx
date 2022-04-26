import React, { useState, useEffect } from 'react'
import { Canvas, NodeData, EdgeData, Label, Node, ElkNodeLayoutOptions } from 'reaflow'
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { Client } from '../App'

export function SchemaCanvas(props:Client) {

  const [nodes, setNodes] = useState<NodeData[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([]);

  useEffect(() => {
    props.client.get((process.env.REACT_APP_NESTJS_EDGEQL_QUERY_ENDPOINT || '/') + '?query=' + encodeURIComponent("with module schema select ObjectType { name, abstract, bases: { name }, ancestors: { name }, annotations: { name, @value }, links: { name, cardinality, required, target: { name }, }, properties: { name, cardinality, required, target: { name }, }, constraints: { name }, indexes: { expr }, } filter .name like 'default::%'"))
                .then((res) => {
                  let nodeData:NodeData<any>[] = [];
                  let edgeData:EdgeData<any>[] = [];
                  for(let i=0; i<res.data.length; i++) {
                    let name = res.data[i].name.substring('default::'.length)
                    let node = { id: name, text: name }
                    for(let j=1; j<res.data[i].properties.length; j++) {
                      let id = name + '_' + res.data[i].properties[j].name
                      let property:NodeData<any> = { id: id, text: res.data[i].properties[j].name, parent: name }
                      nodeData.push(property)
                    }
                    for(let j=1; j<res.data[i].links.length; j++) {
                      let id = name + '_' + res.data[i].links[j].name
                      let property:NodeData<any> = { id: id, text: res.data[i].links[j].name, parent: name }
                      nodeData.push(property)
                      let targetName = res.data[i].links[j].target.name.substring('default::'.length)
                      let edge:EdgeData<any> = { id: id + '-' + targetName, from: id, to: targetName }
                      edgeData.push(edge);
                    }
                    nodeData.push(node);
                  }
                  console.log(nodeData);
                  console.log(' ')
                  console.log(edgeData)
                  setNodes(nodeData)
                  setEdges(edgeData)
                })
  }, []);


  return (
    <Canvas
      maxHeight={ 1000 }
      layoutOptions={ {
        'elk.hierarchyHandling':'INCLUDE_CHILDREN',
        'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT',
      } }
      nodes={nodes}
      edges={edges}
      node={
        (node) => <Node label={<Label style={ { transform: "translateY(25px)", stroke: "#000" } } />} style={ { stroke: '#000', fill: '#fff' } } />
      }
      onLayoutChange={layout => console.log('Layout', layout)}
    />
  );
}