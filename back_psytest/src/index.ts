import { Dialute, SberRequest } from 'dialute';
import e from 'express';
import { stat } from 'fs';
import { data } from './data';
import { psytypes } from './psytypes';

const questions = data;

function* script(r: SberRequest) {
  const rsp = r.buildRsp();

  const state = {
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

  function updateState(ans: any) {
    if (!(questions[state.id].options[ans].koe === undefined)) {
      state.e += Number(questions[state.id].options[ans].koe.e === undefined? '0' : questions[state.id].options[ans].koe.e);
      state.l += Number(questions[state.id].options[ans].koe.l === undefined? '0' : questions[state.id].options[ans].koe.l);
      state.n += Number(questions[state.id].options[ans].koe.n === undefined? '0' : questions[state.id].options[ans].koe.n);

    }

    state.intro = false;
    state.done = false;
    state.id += 1;
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
        {
          text: ['Выход'],
          koe: {
            e: 0,
            n: 0,
            l: 0
          }
        }
      ]
    }
    rsp.data = state;
  }

  function checkArray(r: any, arr: any) {
    return r.nlu.lemmaIntersection(arr) || arr.includes(r.msg.toLowerCase());
  }

  startState();
  rsp.msg = 'Добро пожаловать!';
  rsp.msgJ = 'Привет!';
  yield rsp;

  while (state.id <= 56){
    if (r.type === 'SERVER_ACTION'){
      console.log(r.act?.action_id)
      if (r.act?.action_id == 'click'){
        console.log(r.act.data);
        if (r.act.data != 10) updateState(r.act.data);
        else {
          rsp.msg = 'Всего вам доброго!';
          rsp.msgJ = 'Еще увидимся. Пока!';
          rsp.end = true;
          rsp.data = {'type': 'close_app'}
        }
      }
      yield rsp;
      continue;
    }

    else if (r.nlu.lemmaIntersection(['выход', 'выйти', 'выйди'])) {
      rsp.msg = 'Всего вам доброго!';
      rsp.msgJ = 'Еще увидимся. Пока!';
      rsp.end = true;
      rsp.data = {'type': 'close_app'}
    }

    else if (checkArray(r, ['да', 'согласен', 'да да'])) {updateState(0);}
    else if (checkArray(r, ['нет', 'не согласен', 'сомневаюсь'])) {updateState(1);}
    else if (checkArray(r, ['возможно', 'не знаю'])) {updateState(2);}
    else if (checkArray(r, ['начать', 'старт', 'начинай'])) {updateState(0);}

    yield rsp;
  }

  getPsytype()
  yield rsp;
}



Dialute
    .fromEntrypoint(script as GeneratorFunction)
    .shareApp('../app/public')
    .start();
