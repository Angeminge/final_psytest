// import { channel } from 'diagnostics_channel';
import { Dialute, SberRequest } from 'dialute';
import { data } from './data';
import { psytypes } from './psytypes';

const questions = data;
var flag = false;
var array_e  = Array(57).fill(0);
var array_l  = Array(57).fill(0);
var array_n  = Array(57).fill(0);

function* script(r: SberRequest) {
  var rsp = r.buildRsp();

  const state: any = {
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

  function updateState(ans: any, back=false,first_q=false) {
    if(first_q){
      state.id = 1;
      state.e = 0;
      state.l = 0;
      state.n = 0;
      array_e  = Array(57).fill(0);
      array_l  = Array(57).fill(0);
      array_n  = Array(57).fill(0);
    }
    else if (back){
      state.id -= 1
      array_e[state.id] = 0;
      array_l[state.id] = 0;
      array_n[state.id] = 0;

    }

    else if (!(questions[state.id].options[ans].koe === undefined)) {      
      array_e[state.id] = Number(questions[state.id].options[ans].koe.e === undefined? '0' : questions[state.id].options[ans].koe.e);
      array_l[state.id] = Number(questions[state.id].options[ans].koe.l === undefined? '0' : questions[state.id].options[ans].koe.l);
      array_n[state.id] = Number(questions[state.id].options[ans].koe.n === undefined? '0' : questions[state.id].options[ans].koe.n);
      state.id += 1;
    }

    state.e = array_e.reduce(function(acc, val) { return acc + val; }, 0);
    state.l = array_l.reduce(function(acc, val) { return acc + val; }, 0);
    state.n = array_n.reduce(function(acc, val) { return acc + val; }, 0);
    state.intro = false;
    state.done = false;
    
    state.question = questions[state.id]

    rsp.msg = questions[state.id].texts;
    rsp.msgJ = questions[state.id].textj;
    rsp.data = state;
  }

  function startState() {
    state.intro = true;
    state.question = questions[0]
    rsp.data = state;
  }

  function gotoState(state: any) {

    state.done = true;
    state.id = state;
    state.question = questions[state.id]

    rsp.msg = questions[state.id].texts;
    rsp.msgJ = questions[state.id].textj;
    rsp.data = state;
  }

  function calculateResult() {
    if (state.n < 12 && state.e < 12) {
      return 0;
    } else if (state.n < 12 && state.e >= 12) {
      return 1;
    } else if (state.n >= 12 && state.e < 12) {
      return 2;
    } else if (state.n >= 12 && state.e >= 12) {
      return 3;
    }
  }

  function getPsytype() {
    let v = calculateResult();

    rsp.msg = 'Ваш тип: ' + psytypes[v].name + '. ' + psytypes[v].description;
    rsp.msgJ = 'Твой тип: ' + psytypes[v].name + '. ' + psytypes[v].description; 
    state.done = true;
    state.type = psytypes[v];
    state.question = {id: -2,
      texts: 'Ваш тип: ' + psytypes[v].name + '. ' + psytypes[v].description,
      texta: 'Ваш тип: ' + psytypes[v].name + '. ' + psytypes[v].description,
      textj: 'Твой тип: ' + psytypes[v].name + '. ' + psytypes[v].description,

      options: [
        {
          text: ['Еще раз'],
          koe: {
            e: 0,
            n: 0,
            l: 0
          }
        },
      ]
    };

    if (!flag) {
      state.question.options.push({
        text: ['Оценить смартап'],
        koe: {
          e: 0,
          n: 0,
          l: 0
        }
      });
    }
    rsp.data = state;
  }

  function getPsytypeWithoutVoice() {
    let v = calculateResult();

    state.done = true;
    state.type = psytypes[v];
    state.question = {id: -3,
      texts: 'Ваш тип: ' + psytypes[v].name + '. ' + psytypes[v].description,
      texta: 'Ваш тип: ' + psytypes[v].name + '. ' + psytypes[v].description,
      textj: 'Твой тип: ' + psytypes[v].name + '. ' + psytypes[v].description,

      options: [
        {
          text: ['Еще раз'],
          koe: {
            e: 0,
            n: 0,
            l: 0
          }
        }
      ]
    };

    rsp.data = state;
  }

  function checkArray(r: any, arr: any) {

    return r.nlu.lemmaIntersection(arr) || arr.includes(r.msg.toLowerCase());
  }

  startState();
  rsp.msg = questions[0].texts;
  rsp.msgJ = questions[0].textj;
  yield rsp;

  while (state.id <= 56){
    console.log('current', state.id);
    if (r.type === 'SERVER_ACTION'){
      console.log(r.act?.action_id)
      if (r.act?.action_id == 'click'){
        console.log(typeof r.act.data, r.act.data);
        updateState(r.act.data);        
      }
      yield rsp;
      continue;
    }
    
    else if (checkArray(r,['выход', 'выйти', 'выйди'])) {
      rsp.msg = 'Всего вам доброго!';
      rsp.msgJ = 'Еще увидимся. Пока!';
      rsp.end = true;
      rsp.data = {type: 'close_app'};
    }
    else if (checkArray(r, ['начало'])){updateState(0, false,true)}
    else if (checkArray(r, ['назад'])){updateState(0, true)}
    else if (checkArray(r, ['да', 'согласен', 'да да'])) {updateState(0);}
    else if (checkArray(r, ['нет', 'не согласен', 'сомневаюсь'])) {updateState(1);}
    else if (checkArray(r, ['возможно', 'не знаю'])) {updateState(2);}
    else if (checkArray(r, ['начать', 'старт', 'начинай'])) {updateState(0);}
    yield rsp;
  }
  
  getPsytype();
  yield rsp;

  while (true) {
    if (r.type === 'SERVER_ACTION') {
      console.log(r.act?.action_id)
      if (r.act?.action_id == 'click'){
        console.log(r.act.data);
        if (r.act.data == 5) {
          break; 
        } else {
          rsp.msg = 'Поставьте навыку оценку';
          rsp.msg = 'Поставь навыку оценку';
          rsp.body.messageName = 'CALL_RATING';
          flag = true;
        }
        yield rsp;
        rsp = r.buildRsp();
        continue;
      }
      yield rsp;
      continue;
    } else if (r.type !== "MESSAGE_TO_SKILL" && r.type !== "RUN_APP" && r.type !== "CLOSE_APP") {
      rsp.data = {type: 'mark'};
      rsp.msg = 'Спасибо за оценку!';      
    } else if (checkArray(r, ['оценить', 'поставить оценку'])) {
      rsp.msg = 'Поставьте навыку оценку';
      rsp.msg = 'Поставь навыку оценку';
      rsp.body.messageName = 'CALL_RATING';
      flag = true;
    } else if (checkArray(r, ['заново', 'еще раз'])) {break;}

    getPsytype();
    yield rsp;
  }
}



Dialute
    .fromEntrypoint(script as GeneratorFunction)
    .shareApp('../app/public')
    .start();
