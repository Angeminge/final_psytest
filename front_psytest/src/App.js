import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import { Container } from '@sberdevices/plasma-ui/components/Grid';

import "./App.css";
import Scene from './pages/scene';



export class App extends React.Component {

  render() {
    console.log('render this');
    return (
      <Container>

        <Scene />

      </Container>
    )
  }
}
