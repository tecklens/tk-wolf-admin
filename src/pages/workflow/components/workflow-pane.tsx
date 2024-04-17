import {Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import 'reactflow/dist/style.css';
import RedisNode from "@/pages/workflow/components/nodes/RedisNode.tsx";
import WebNode from "@/pages/workflow/components/nodes/WebNode.tsx";
import ServiceNode from "@/pages/workflow/components/nodes/ServiceNode.tsx";
import DatabaseNode from "@/pages/workflow/components/nodes/DatabaseNode.tsx";
import KeycloakNode from "@/pages/workflow/components/nodes/KeycloakNode.tsx";
import {useEffect} from "react";

const nodeTypes = {
  service: ServiceNode,
  web: WebNode,
  redis: RedisNode,
  database: DatabaseNode,
  keycloak: KeycloakNode,
}
const minimapStyle = {
  height: 120,
};
export default function WorkflowPane() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    const onChange = (event: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') {
            return node;
          }

          const color = event.target.value;

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        })
      );
    };

    setNodes([
      {id: '1', position: {x: 0, y: 0}, data: {label: '1', onChange,}, type: 'service',},
      {id: '2', position: {x: 0, y: 100}, data: {label: '2', onChange,}, type: 'service',},
    ]);

    setEdges([
      {id: 'e1-2', source: '1', target: '2'}
    ]);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      className={'flex-1'}
      zoomOnScroll={false}
      zoomOnDoubleClick={false}
      zoomOnPinch={false}
      nodeTypes={nodeTypes}
    >
      <MiniMap style={minimapStyle} zoomable pannable/>
      <Controls showZoom={false}/>
      <Background color="#aaa" gap={16}/>
    </ReactFlow>
  )
}