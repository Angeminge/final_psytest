import getScene, { API_URL } from '../services/APIHelper.js'
import React from 'react';

import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import { Button } from '@sberdevices/ui/components/Button/Button';
import { Row, Col } from '@sberdevices/plasma-ui/components/Grid';
import { Spinner } from '@sberdevices/plasma-ui/components/Spinner'

import Indicators from '../components/indicator'
import './scene.css';
import '../components/Chart.jsx';
import '../components/centerButtons.css'
import '../components/centerText.css'
import '../components/centerPic.css'
import '../components/sthg.css'
import '../components/startText.css'
import '../components/buttonText.css'
import '../components/lastBut.css'
import '../components/centerSpinner.css'
import { PsyTestChart } from '../components/Chart.jsx';
import ProgressBar from "../components/ProgressBar";


let characterID;

const setBackground = {
  backgroundImage: ''
}

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};


const fetchedData = async (id) => {
  return await getScene(id);
}

export class Scene extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      id: 0,
      e: 0,
      l: 0,
      n: 0,
      question: {},
      type: {
        id: -1,
        name: "",
        img: "",
        description: ""
      },
      intro: false,
      done: false
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    
    this.assistant.on('start', () => {
      console.log('SmartApp started');
    });

    this.assistant.on('data', data => {
      console.log(data);
      if (data.type == 'smart_app_data') {
        this.state = data.smart_app_data;
        this.setState({scene: this.state});
      }
    });
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state);

    const state = {
      item_selector: {
        items: { 
          text : this.state.scene.text, 
          texts : this.state.scene.texts,
          texta : this.state.scene.texta,
          textj : this.state.scene.textj,
         }
      }
    };

    console.log('getStateForAssistant: state:', state)
    return state;
  }

  handleClick(n) {
    console.log("send data")
    console.log(n);
    this.assistant.sendData({
      action: {
        action_id: 'click',
        data: n
      }
    });
  }

  push(action) {
    if (action.choice == 'Начать') {
      this.handleClick(0);
    }

    if (action.choice == 'Выход') {
      this.handleClick(-1);
    }

    if (action.choice == 'Да') {
      this.handleClick(0);
    }

    if (action.choice == 'Нет') {
      this.handleClick(1);
    }

    if (action.choice == 'Возможно') {
      this.handleClick(2);
    }
  }


  render() {
    
    const { scene, backgroundImage } = this.state;
    console.log("SCENE ", scene);
    if (scene) {
      if (scene.intro) {
        return(
          <>
              < >
              <Col type="calc" offsetS={1} offsetM={2} offsetL={3} offsetXL={4} sizeS={1} sizeM={2} sizeL={3} sizeXL={4} />
              <h1 className='textWrapper'> { scene.question.texts } </h1>
              {
                scene.question.options.map((item) => {
                  return (
                    <Row>
                      <Button scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '12px', width: '100%' }} stretch={true} size="l" onClick={ () => this.push({choice: item.text[0]}) }>
                      <div className='butTextWrapper'> {item.text[0]} </div>
                      </Button>
                    </Row>
                  );
                })
              }
            </>
            </>
        );
      } else if (scene.done) {
        return(
          <>
            <Row className='rowWrapper'>
              <Col className='centerPic'>
                <img src={'/images/'+ scene.type.img} width={400}/>
              </Col>
              <Col className = 'results' type="rel" sizeS={4} sizeM={3} sizeL={3} sizeXL={6}>
                <h1 className='result-h'>{'Вы - '+ scene.type.name}</h1>
                <p className='result-p'>{scene.type.description}</p>
              </Col>
            </Row>
            </>
        );
      } else {
        if (document.documentElement.clientWidth>=1.3*document.documentElement.clientHeight){
          return (
              <Row className="inline">
                <Col className="inline-content" type="rel">
                  <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                  <h1 className='centerText'> {scene.question.texts} </h1>
                  {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={item.id}
                                    scaleOnInteraction={false}
                                    scaleOnHover={false}
                                    scaleOnPress={false}                                    style={{marginBottom: '12px', width: '100%'}}
                                    stretch={true} size="s"
                                    onClick={() => this.push({choice: item.text[0]})}>
                              <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>);
                    })
                  }
                </Col>
                <Col className="chart" type="rel">
                  {PsyTestChart(scene.n, scene.e, 400)}
                </Col>
              </Row>
          );
        } else {
          return (
              <div className="incol" >
                <div className="incol-content">
                  <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                  <h1 className='centerText'> {scene.question.texts } </h1>
                  {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={item.id}
                                    scaleOnInteraction = {false}
                                    scaleOnHover = {false} scaleOnPress = {false}
                                    style={{ marginBottom: '12px', width: '100%' }}
                                    stretch={true} size="s"
                                    onClick={ () => this.push({choice: item.text[0]}) }>
                              <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>);
                    })
                  }
                </div>
                <div className="incol-chart">
                  {PsyTestChart(scene.n, scene.e, 300)}
                </div>
              </div>
          );
        }
      }
    } else {
      return (<Spinner className='spinnerWrapper'/>);
    }
  }
}

export default Scene;