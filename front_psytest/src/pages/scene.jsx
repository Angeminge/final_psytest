import getScene, { API_URL } from '../services/APIHelper.js'
import React from 'react';

import {
  createSmartappDebugger,
  createAssistant,
  createAssistantDev,
} from "@salutejs/client";
import {detectDevice} from "@sberdevices/ui/utils";

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
import {Container} from "@sberdevices/ui";
import {IconArrowLeft} from "@sberdevices/plasma-icons";


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

    if (action.choice == 'Назад') {
      this.handleClick(3);
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
    const deviceKind = detectDevice();
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
              < >
              <Col type="calc" offsetS={1} offsetM={2} offsetL={3} offsetXL={4} sizeS={1} sizeM={2} sizeL={3} sizeXL={4} />
              <h1 className='textWrapper'> { characterID == 'joy'? scene.question.textj : scene.question.texts } </h1>
              {
                scene.question.options.map((item) => {
                  return (
                    <Row>
                      <Button key={'-1.'+item.id} scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '12px', width: '100%' }} stretch={true} size="l" onClick={ () => this.push({choice: item.text[0]}) } focused ={false} outlined={true}>
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
        if (document.documentElement.clientWidth>=document.documentElement.clientHeight || deviceKind==="SberBox" || deviceKind==="SberPortal"){
        return(
          <>
            <Row className='rowWrapper'>
              <Col className='centerPic'>
                <img src={'/images/'+ scene.type.img} width={400}/>
              </Col>
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
        if (document.documentElement.clientWidth>=document.documentElement.clientHeight || deviceKind.toLowerCase()==="sberbox" || deviceKind==="SberPortal"){
          return (
              <Container className="container">
                <Row>
                  <Col sizeS={2} sizeM={3} sizeL={4} sizeXL={6}>
                    <div className="filler">
                      <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                      <h1> {scene.question.texts} </h1>
                      {scene.question.options.map((item) => {
                        return(
                            <Row sizeS={4} sizeM={6} sizeL={6} sizeXL={6} >
                              <Button key={scene.id + '.' + item.id}
                                      scaleOnHover={true}
                                      scaleOnPress={false}
                                      style={{marginBottom: '20px', width: '100%'}}
                                  //size="s"
                                      stretch={true}
                                      onClick={() => this.push({choice: item.text[0]})}
                                      outline={true}
                                      text={item.text[0]}
                              />
                            </Row>);
                      })
                      }
                      <Button contentLeft={<IconArrowLeft/>} style={{marginTop:'20%'}}
                              onClick={() => this.push({choice: ['Назад']})}/>
                    </div>
                  </Col>
                  <Col sizeS={2} sizeM={3} sizeL={4} sizeXL={6}>
                    <div className="chart-container-desktop">
                      <PsyTestChart n={scene.n} e={scene.e} size={size} />
                    </div>
                  </Col>
                </Row>
              </Container>
          );

        } 
        else {
          return (
              <Container className="container">
                <Row sizeS={4} sizeM={6} sizeL={8} sizeXL={12}>

                  <div className="filler">
                    <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
                    <h1> {scene.question.texts} </h1>
                    {scene.question.options.map((item) => {
                      return(
                          <Row sizeS={4} sizeM={6} sizeL={6} sizeXL={6} >
                            <Button key={scene.id + '.' + item.id}
                                    scaleOnHover={true}
                                    scaleOnPress={false}
                                    style={{marginBottom: '20px', width: '100%'}}
                                //size="s"
                                    stretch={true}
                                    onClick={() => this.push({choice: item.text[0]})}
                                    outline={true}
                                    text={item.text[0]}
                            />
                          </Row>);
                    })
                    }
                    <Button contentLeft={<IconArrowLeft/>} style={{marginTop:'20%'}}
                            onClick={() => this.push({choice: ['Назад']})}/>
                  </div>

                  <Row sizeS={4} sizeM={6} sizeL={8} sizeXL={12}>
                    <div className="chart-container-mobile">
                      <PsyTestChart n={scene.n} e={scene.e} size={size} />
                    </div>
                  </Row>
                </Row>
              </Container>
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
