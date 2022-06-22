import { Dialute, SberRequest } from 'dialute';
import { data } from './data';
import { psytypes } from './psytypes';

function* script(r: SberRequest) {
  const questions = data;
  var flag = false;

  var rsp = r.buildRsp();

  var lastIds: any = [];
  var resetFlag = false;
  var state: any = {
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
    lastIds.push(ans);
    if (!(questions[state.id].options[ans].koe === undefined)) {
      state.e += Number(questions[state.id].options[ans].koe.e === undefined? '0' : questions[state.id].options[ans].koe.e);
      state.l += Number(questions[state.id].options[ans].koe.l === undefined? '0' : questions[state.id].options[ans].koe.l);
      state.n += Number(questions[state.id].options[ans].koe.n === undefined? '0' : questions[state.id].options[ans].koe.n);

    }

    state.intro = false;
    state.done = false;
    state.id += 1;
    state.question = questions[state.id];

    rsp.msg = questions[state.id].texts;
    rsp.msgJ = questions[state.id].textj;
    rsp.data = state;
  }

  function revertState() {
    var lastId = lastIds.pop();
    state.id -= 1;
    if (!(questions[state.id-1].options[lastId].koe === undefined)) {
      state.e -= Number(questions[state.id].options[lastId].koe.e === undefined? '0' : questions[state.id].options[lastId].koe.e);
      state.l -= Number(questions[state.id].options[lastId].koe.l === undefined? '0' : questions[state.id].options[lastId].koe.l);
      state.n -= Number(questions[state.id].options[lastId].koe.n === undefined? '0' : questions[state.id].options[lastId].koe.n);
    }

    state.intro = false;
    state.done = false;
    state.question = questions[state.id];

    rsp.msg = questions[state.id].texts;
    rsp.msgJ = questions[state.id].textj;
    rsp.data = state;
  }

  function restart() {
    state = {
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

    rsp.kbrd = [];
    startState();
  }

  function startState() {
    state.intro = true;
    state.question = questions[0];
    rsp.data = state;
    rsp.msg = questions[0].texts;
    rsp.msgJ = questions[0].textj;
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
    state.question = {
      id: -2,
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
  rsp.kbrd = ['Помощь'];
  yield rsp;

  while (state.id <= 56){
    rsp = r.buildRsp();
    console.log('current id', state.id);
    if (r.msg) {
      console.log(r.msg.toLowerCase());
    }
    if (r.type === 'SERVER_ACTION'){
      console.log(r.act?.action_id)
      if (r.act?.action_id == 'click'){
        console.log(typeof r.act.data, r.act.data);
        updateState(r.act.data);        
      }
    }
    else if (state.id > 0 && checkArray(r, ['помощь', 'помоги', 'справка'])) {
      rsp.msg = 'Скажите или выберите «Да», «Нет», «Возможно» для ответа на вопрос. Чтобы вернуться к предыдущему вопросу, скажите «Шаг назад», чтобы начать сначала, скажите «Перезапусти тест»';
      rsp.msgJ = 'Скажи или выбери «Да», «Нет», «Возможно» для ответа на вопрос. Чтобы вернуться к предыдущему вопросу, скажи «Шаг назад», чтобы начать сначала, скажи «Перезапусти тест»';
    }
    else if (state.id == 0 && checkArray(r, ['помощь', 'помоги', 'справка'])) {
      rsp.msg = 'Я начну задавать вопросы после того, как вы скажете «начать», если вы захотите закончить, скажите «выйти»';
      rsp.msgJ = 'Я начну задавать вопросы после того, как вы скажете «начать», если вы захотите закончить, скажите «выйти»';
    }
    else if (checkArray(r, ['что ты умеешь', 'что умеет навык', 'что ты умеешь?', 'что умеет навык?'])) {
      rsp.msg = 'Данный навык поможет вам определить ваш темперамент посредством прохождения психологического тестирования';
      rsp.msgJ = 'Этот навык поможет тебе определить свой темперамент посредством прохождения психологического тестирования';
    }
    else if (checkArray(r, ['да', 'согласен', 'да да'])) {updateState(0);}
    else if (checkArray(r, ['нет', 'не согласен', 'сомневаюсь'])) {updateState(1);}
    else if (checkArray(r, ['возможно', 'не знаю'])) {updateState(2);}
    else if (state.id == 0 && checkArray(r, ['начать', 'старт', 'начинай'])) {updateState(0);}
    else if (state.id > 1 && checkArray(r, ['шаг назад'])) {revertState();}
    else if (checkArray(r, ['перезапустить тест', 'перезапусти тест'])) {console.log('restart');restart()}
    else if (state.id == 1 && checkArray(r, ['шаг назад'])) {
      rsp.msg = 'Это первый вопрос';
      rsp.msgJ = 'Это первый вопрос';
    }

    if (state.id > 1) {
      rsp.kbrd = ['Шаг назад', 'Перезапустить тест', 'Помощь'];
    } else {
      rsp.kbrd = ['Помощь'];
    }

    console.log(state.e, state.l, state.n);
    yield rsp;
  }
  
  rsp.kbrd = ['Оценить', 'Помощь'];
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
          yield rsp;
          rsp = r.buildRsp();
          rsp.kbrd = ['Помощь'];
          continue;
        }
      }
      yield rsp;
      continue;
    } else if (checkArray(r, ['помощь', 'помоги', 'справка'])) {
      rsp.msg = 'Скажите или выберите «Еще раз» для того чтобы повторить тест, скажите «Выход» чтобы выйти';
      rsp.msgJ = 'Скажи или выбери «Еще раз» для того чтобы повторить тест, скажи «Выход» чтобы выйти';
    } else if (checkArray(r, ['что ты умеешь', 'что умеет навык', 'что ты умеешь?', 'что умеет навык?'])) {
      rsp.msg = 'Данный навык поможет вам определить ваш темперамент посредством прохождения психологического тестирования';
      rsp.msgJ = 'Этот навык поможет тебе определить свой темперамент посредством прохождения психологического тестирования';
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
