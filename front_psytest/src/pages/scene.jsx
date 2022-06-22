import getScene, { API_URL } from '../services/APIHelper.js'
import React from 'react';

import {
  createSmartappDebugger,
  createAssistant,
  createAssistantDev,
} from "@salutejs/client";

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


var characterID = '';

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

      if (data.type === 'character') {
        characterID = data.character.id;
      }

      if (data.type == 'smart_app_data') {
        this.state = data.smart_app_data;
        console.log(this.state);
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
      this.handleClick(10);
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

    if (action.choice == 'Еще раз') {
      this.handleClick(5);
    }

    if (action.choice == 'Оценить смартап') {
      this.handleClick(7);
    }
  }


  render() {
    
    const { scene, backgroundImage } = this.state;
    console.log("SCENE ", scene);
    let size = 300;
    if (document.documentElement.clientWidth>=document.documentElement.clientHeight){
      size = document.documentElement.clientWidth*0.3;
      console.log("size", size);
    }
    else{
      size = document.documentElement.clientWidth*0.9;
      console.log("size", size);
    }
    if (scene) {
      if (scene.intro) {
        return(
          <>
          <h1 className='textWrapper'> { characterID == 'joy'? scene.question.textj : scene.question.texts } </h1>
              {
                scene.question.options.map((item) => {
                  return (
                    <Row>
                      <Button key={'-1.'+item.id} scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '12px', width: '100%', height: '4rem'}} stretch={true} size="l" onClick={ () => this.push({choice: item.text[0]}) } focused ={false} outlined={true}>
                      <div className='butTextWrapper'> {item.text[0]} </div>
                      </Button>
                    </Row>
                  );
                })
              }
          </>
        );
      } else if (scene.done) {
        //desktop
        if (document.documentElement.clientWidth>=document.documentElement.clientHeight){
        return(
          <>
            <Col>
            <Row className='rowWrapper'>
              <Col className='centerPic'>
                <img src={'/images/'+ scene.type.img} width={size}/>
              </Col>
              <Col className = 'results' type="rel" sizeS={4} sizeM={3} sizeL={3} sizeXL={6}>
                <h1 className='centerText'>{(characterID == 'joy'? 'Ты ' : 'Вы ') + scene.type.name}</h1>
                <p className=''>{scene.type.description}</p>
                {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={scene.id+'.'+item.id}
                                    scaleOnHover={true}
                                    scaleOnPress={false}
                                    style={{marginBottom: '12px', width: '100%', height: '3.3rem'}}
                                    stretch={true} size="s"
                                    onClick={() => this.push({choice: item.text[0]})}>
                              <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>);
                    })
                  }
              </Col>
            </Row>
            </Col>
            </>
        ); 
      } else {
        return(
          <>
            <Row className='rowWrapper'>
              <Col className = 'results' type="rel" sizeS={4} sizeM={3} sizeL={3} sizeXL={6}>
                <h1 className='result-h'>{(characterID == 'joy'? 'Ты ' : 'Вы ') + scene.type.name}</h1>
                <p className='result-p'>{scene.type.description}</p>
                {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={scene.id+'.'+item.id}
                                    scaleOnHover={true}
                                    scaleOnPress={false}
                                    style={{marginBottom: '12px', width: '100%'}}
                                    stretch={true} size="s"
                                    onClick={() => this.push({choice: item.text[0]})}>
                              <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>);
                    })
                  }
              </Col>
            </Row>
            </>
        ); 
      }
      } else {
        //desktop
        if (document.documentElement.clientWidth>=document.documentElement.clientHeight){
          return (
              <Row className="inline">
                <Col className="inline-content" type="rel">
                  <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                  <h1 className='centerText'> { characterID == 'joy'? scene.question.textj : scene.question.texts } </h1>
                  {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={scene.id+'.'+item.id}
                                    scaleOnHover={true}
                                    scaleOnPress={false}
                                    style={{marginBottom: '12px', width: '100%', height: '3.3rem'}}
                                    stretch={true} size="s"
                                    onClick={() => this.push({choice: item.text[0]})}>
                              <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>);
                    })
                  }
                </Col>
                <Col className="chart" type="rel">
                  {PsyTestChart(scene.n, scene.e, size*0.9)}
                </Col>
              </Row>
          );
        } 
        else {
          return (
              <div className="incol" >
                <div className="incol-content">
                  <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                  <h1 className='centerText'> { characterID == 'joy'? scene.question.textj : scene.question.texts  } </h1>
                  {
                    scene.question.options.map((item) => {
                      return (
                          <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                            <Button key={scene.id+'.'+item.id}
                                    scaleOnHover = {true} scaleOnPress = {false}
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
                  {PsyTestChart(scene.n, scene.e, size)}
                </div>
              </div>
          );
        }
      } 
}
else {
      return (<Spinner className='spinnerWrapper'/>);
    }
  }
}

export default Scene;
