// Previous front Desktop Format

// return (
//     <Row className="inline">
//       <Col className="inline-content" type="rel">
//         <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
//         <h1 className='centerText'> { characterID == 'joy'? scene.question.textj : scene.question.texts } </h1>
//         {
//           scene.question.options.map((item) => {
//             return (
//                 <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
//                   <Button key={scene.id+'.'+item.id}
//                           scaleOnHover={true}
//                           scaleOnPress={false}
//                           style={{marginBottom: '12px', width: '100%'}}
//                           stretch={true} size="s"
//                           onClick={() => this.push({choice: item.text[0]})}>
//                     <div className='butTextWrapper'> {item.text[0]} </div>
//                   </Button>
//                 </Row>);
//           })
//         }
//       </Col>
//       <Col className="chart" type="rel">
//         {PsyTestChart(scene.n, scene.e, size*0.9)}
//       </Col>
//     </Row>
// );




// Previous front Mobile Format

// return (
//     <div className="incol" >
//       <div className="incol-content">
//         <ProgressBar key={scene.id} completed={Math.round(scene.id/57*100)}/>
//         <h1 className='centerText'> { characterID == 'joy'? scene.question.textj : scene.question.texts  } </h1>
//         {
//           scene.question.options.map((item) => {
//             return (
//                 <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
//                   <Button key={scene.id+'.'+item.id}
//                           scaleOnHover = {true} scaleOnPress = {false}
//                           style={{ marginBottom: '12px', width: '100%' }}
//                           stretch={true} size="s"
//                           onClick={ () => this.push({choice: item.text[0]}) }>
//                     <div className='butTextWrapper'> {item.text[0]} </div>
//                   </Button>
//                 </Row>);
//           })
//         }
//       </div>
//       <div className="incol-chart">
//         {PsyTestChart(scene.n, scene.e, size)}
//       </div>
//     </div>
// );