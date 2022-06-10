import React from "react";
import "./QuestionPage.css"
import {Col, Row} from "@sberdevices/plasma-ui/components/Grid";
import {Button} from "@sberdevices/ui/components/Button/Button";
import {PsyTestChart} from "./Chart";

function ContentInline(scene){
    return(
        <Row className="blocks">
            <Col className>
                <h1 className='centerText'> { '[Вопрос: ' + scene.id + '/56] ' + scene.question.texts } </h1>
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
            </Col>
            <Col className="chart">
                {PsyTestChart(scene.l, scene.e)}
            </Col>
        </Row>
    )
}

function ContentInCol(scene){
    return(
        <div>
            <div className="content">
                <h1 className='centerText'> { '[Вопрос: ' + scene.id + '/56] ' + scene.question.texts } </h1>
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
            <div className="chart">
                {PsyTestChart(scene.l, scene.e)}
            </div>
        </div>
    )
}


