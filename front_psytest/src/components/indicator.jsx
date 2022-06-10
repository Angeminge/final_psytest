import React from "react";

import { Row } from '@sberdevices/plasma-ui/components/Grid';
import { Toast } from '@sberdevices/plasma-ui';

import './centerIndicators.css'
import './marginIndicators.css'

class Indicators extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Row className = 'centerInd'>
                <div className='indWrapper'> <Toast  text={`Вопрос: ${this.props.n}/56`} /> </div>
            </Row>
        );
    }
  }

export default Indicators;