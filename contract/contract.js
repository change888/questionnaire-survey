'use strict';

var minUnit = 1000000000000000000;
var minAmount = new BigNumber(0).mul(minUnit);
var pageNumber = 1;
var pageSize = 10;

//调查
var Survey = function(text) {
  if (text) {
    var o = typeof text === 'string' ? JSON.parse(text) : text;
    this.title = o.title;
    this.content = o.content;
    this.amount = o.amount;
    this.type = o.type;
    this.minScore = o.minScore;
    this.number = o.number;
    this.startTime = o.startTime;
    this.endTime = o.endTime;
    this.id = o.id;
    this.auther = o.auther;
    this.createTime = o.createTime;
    this.respondents = o.respondents;
    this.status = o.status; //1:表示活动进行中，2:表示活动结束可以开奖，3:表示已经开过奖，4:表示已经结束
    this.balance = o.balance || new BigNumber(o.amount).mul(minUnit);
    this.winners = o.winners;
    this.answers = o.answers;
  } else {
    this.title = '';
    this.content = '';
    this.amount = '';
    this.type = '';
    this.minScore = '';
    this.number = '';
    this.startTime = '';
    this.endTime = '';
    this.id = '';
    this.auther = '';
    this.createTime = '';
    this.respondents = '';
    this.status = 1;
    this.balance = new BigNumber(0); //剩余金额
    this.winners = [];
    this.answers = [];
  }
};

Survey.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
};

//问题
var Question = function(text) {
  if (text) {
    var o = typeof text === 'string' ? JSON.parse(text) : text;
    this.id = o.id;
    this.title = o.title;
    this.optionsA = o.optionsA;
    this.optionsB = o.optionsB;
    this.optionsC = o.optionsC;
    this.optionsD = o.optionsD;
    this.Acount = o.Acount;
    this.Bcount = o.Bcount;
    this.Ccount = o.Ccount;
    this.Dcount = o.Dcount;
  } else {
    this.id = o.id;
    this.title = '';
    this.optionsA = '';
    this.optionsB = '';
    this.optionsC = '';
    this.optionsD = '';
    this.Acount = '';
    this.Bcount = '';
    this.Ccount = '';
    this.Dcount = '';
  }
};

Question.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
};

//答案
var Answer = function(text) {
  if (text) {
    var o = typeof text === 'string' ? JSON.parse(text) : text;
    this.id = o.id;
    this.auther = o.auther;
    this.createTime = o.createTime;
    this.answers = o.answers;
  } else {
    this.id = '';
    this.auther = '';
    this.createTime = '';
    this.answers = '';
  }
};

Answer.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
};

//合约入口
var QuestionnaireSurveyContract = function() {
  LocalContractStorage.defineMapProperty(this, "surveies", {
    parse: function(text) {
      return new Survey(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "questions", {
    parse: function(text) {
      return new Question(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "answers", {
    parse: function(text) {
      return new Answer(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineProperty(this, "amount", {
    parse: function(text) {
      return new BigNumber(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineProperty(this, "total");
  LocalContractStorage.defineProperty(this, "admin");

  LocalContractStorage.defineMapProperty(this, "surveyByQuestionIds");
  LocalContractStorage.defineMapProperty(this, "surveyByAnswerIds");
  LocalContractStorage.defineMapProperty(this, "surveyIndex");
  LocalContractStorage.defineMapProperty(this, "authorBySurveyIds");
  LocalContractStorage.defineMapProperty(this, "joinBySurveyIds");
  LocalContractStorage.defineMapProperty(this, "winners");
}

QuestionnaireSurveyContract.prototype = {
  init: function() {
    this.total = 0;
    this.amount = 0;
    this.admin = 'n1LXgaKh5uHJJckEK4cJ9BGS5vTMHeCG7b6';
  },
  saveSurvey: function(form, questions) {
    var validateResult = this._validate(form, questions);
    var balance = Blockchain.transaction.value;

    if (validateResult !== true) {
      throw new Error(validateResult);
    }

    if (!new BigNumber(form.amount).mul(minUnit).eq(balance)) {
      throw new Error("The amount sent is wrong");
    }

    if (new BigNumber(form.amount).mul(minUnit).lt(minAmount)) {
      throw new Error("The amount is too little");
    }

    var id = this._guid();
    var auther = Blockchain.transaction.from;
    var ids = this.authorBySurveyIds.get(auther) || [];
    var survey = new Survey(form);

    ids.push(id);

    survey.id = id;
    survey.auther = auther;
    survey.createTime = new Date().getTime();
    survey.respondents = 0;
    survey.status = survey.createTime >= survey.endTime ? 2 : 1;

    this._saveQuestions(questions, id);
    this._plusAmount(survey.amount);

    this.surveies.put(id, survey);
    this.surveyIndex.put(this.total, id);
    this.authorBySurveyIds.put(auther, ids);

    this.total += 1;
  },
  getById: function(id) {
    if (!id) {
      return {
        success: 0,
        msg: 'The query id is required',
        code: 42
      };
    }
    var survey = this.surveies.get(id);
    if (!survey) {
      return {
        success: 0,
        msg: 'Your queries does not exist',
        code: 43
      };
    }

    survey.status = survey.status === 1 && (new Date().getTime() >= survey.endTime) ? 2 : survey.status;
    survey.questions = this._getQuestionsBySurveyId(id);
    survey.answers = this._getAnswersBySurveyId(id);
    survey.winners = this._getWinnersBySurveyId(id);

    return {
      success: 1,
      msg: 'ok',
      data: survey,
      code: 0
    };
  },
  getList: function(pageNumber, pageSize) {
    pageNumber = this._transformPageNumber(pageNumber);
    pageSize = this._transformPageSize(pageSize);

    var start = (pageNumber - 1) * pageSize;
    var end = pageNumber * pageSize;
    var total = this.total;
    var rows = [];

    if (end >= total) {
      end = total;
    }

    if (start > total) {
      return {
        success: 1,
        msg: 'ok',
        data: {
          total: total,
          rows: rows
        },
        code: 0
      };
    }

    var survey = null;
    var id = '';
    for (var i = start; i < end; i++) {
      id = this.surveyIndex.get(i);
      survey = this.surveies.get(id);
      if (survey) {
        survey.status = survey.status === 1 && (new Date().getTime() >= survey.endTime) ? 2 : survey.status;
        survey.questions = this._getQuestionsBySurveyId(id);
        survey.answers = this._getAnswersBySurveyId(id);
        survey.winners = this._getWinnersBySurveyId(id);
        rows.push(survey);
      }
    }

    if (rows.length > 0) {
      rows.sort(function(a, b) {
        return b.createTime - a.createTime;
      });
    }

    return {
      success: 1,
      msg: 'ok',
      data: {
        total: total,
        rows: rows
      },
      code: 0
    };
  },
  getPublishList: function(from, pageNumber, pageSize){
    if(!from){
      return {
        success: 0,
        msg: 'no address',
        code: 32
      };
    }

    pageNumber = this._transformPageNumber(pageNumber);
    pageSize = this._transformPageSize(pageSize);

    var start = (pageNumber - 1) * pageSize;
    var end = pageNumber * pageSize;
    var ids = this.authorBySurveyIds.get(from) || [];
    var total = ids.length;
    var rows = [];

    if (end >= total) {
      end = total;
    }

    if (start > total) {
      return {
        success: 1,
        msg: 'ok',
        data: {
          total: total,
          rows: rows
        },
        code: 0
      };
    }

    var survey = null;
    var id = '';
    for (var i = start; i < end; i++) {
      id = ids[i];
      survey = this.surveies.get(id);
      if (survey) {
        survey.status = survey.status === 1 && (new Date().getTime() >= survey.endTime) ? 2 : survey.status;
        survey.questions = this._getQuestionsBySurveyId(id);
        survey.answers = this._getAnswersBySurveyId(id);
        survey.winners = this._getWinnersBySurveyId(id);
        rows.push(survey);
      }
    }

    if (rows.length > 0) {
      rows.sort(function(a, b) {
        return b.createTime - a.createTime;
      });
    }

    return {
      success: 1,
      msg: 'ok',
      data: {
        total: total,
        rows: rows
      },
      code: 0
    };
  },
  getJoinList: function(from, pageNumber, pageSize){
    if(!from){
      return {
        success: 0,
        msg: 'no address',
        code: 32
      };
    }

    pageNumber = this._transformPageNumber(pageNumber);
    pageSize = this._transformPageSize(pageSize);

    var start = (pageNumber - 1) * pageSize;
    var end = pageNumber * pageSize;
    var ids = this.joinBySurveyIds.get(from) || [];
    var total = ids.length;
    var rows = [];

    if (end >= total) {
      end = total;
    }

    if (start > total) {
      return {
        success: 1,
        msg: 'ok',
        data: {
          total: total,
          rows: rows
        },
        code: 0
      };
    }

    var survey = null;
    var id = '';
    for (var i = start; i < end; i++) {
      id = ids[i];
      survey = this.surveies.get(id);
      if (survey) {
        survey.status = survey.status === 1 && (new Date().getTime() >= survey.endTime) ? 2 : survey.status;
        survey.questions = this._getQuestionsBySurveyId(id);
        survey.answers = this._getAnswersBySurveyId(id);
        survey.winners = this._getWinnersBySurveyId(id);
        rows.push(survey);
      }
    }

    if (rows.length > 0) {
      rows.sort(function(a, b) {
        return b.createTime - a.createTime;
      });
    }

    return {
      success: 1,
      msg: 'ok',
      data: {
        total: total,
        rows: rows
      },
      code: 0
    };
  },
  saveAnswer: function(surveyId, answers) {
    if (!surveyId) {
      throw new Error('The query id is required');
    }

    if (!answers) {
      throw new Error('The answers id is required');
    }

    if (this._isAnswered(surveyId)) {
      throw new Error('You had already answered');
    }

    var id = this._guid();
    var auther = Blockchain.transaction.from;
    var ids = this.surveyByAnswerIds.get(surveyId) || [];
    var joinIds = this.joinBySurveyIds.get(auther) || [];
    var answer = new Answer();

    ids.push(id);
    joinIds.push(surveyId);

    answer.answers = answers;
    answer.id = id;
    answer.auther = auther
    answer.createTime = new Date().getTime();

    this.answers.put(id, answer);
    this.surveyByAnswerIds.put(surveyId, ids);
    this.joinBySurveyIds.put(auther, joinIds);

    this._updateRespondents(surveyId);
    this._updateQuestionCounts(answers);
    this._updateSurveyStatus(surveyId);
  },
  claim: function(id) {
    if (!id) {
      throw new Error("claim failed.");
    }

    this._updateSurveyStatus(id);

    var address = Blockchain.transaction.from;
    var survey = this.surveies.get(id);
    var winnerIndex = this._inWinners(address, id);

    if (!survey) {
      throw new Error("no project.");
    }

    //1活动进行中不能开奖，2可以开奖，3活动已经开过奖
    if (survey.status !== 3) {
      throw new Error("The event has not yet been awarded.");
    }

    if (winnerIndex === -1) {
      throw new Error("Sorry, you didn't win.");
    }

    var winner = this.winners.get(id)[winnerIndex];

    if(winner && winner.status === 2){
      throw new Error("You've already received.");
    }

    this._takeout(address, winner.winAmount, (value, from, to) => {
      this._minusAmount(value);
      this._updateSurveyBalance(value, id);
      this._updateWinnerStatus(id, winner.id, 2);
      this._updateSurveyStatusByWinner(id);
    }, (error) => {
      throw new Error(error);
    });
  },
  award: function(id) {
    if (!id) {
      throw new Error("id failed.");
    }
    
    this._updateSurveyStatus(id);

    var survey = this.surveies.get(id);

    if (!survey) {
      throw new Error("no project.");
    }

    //1活动进行中不能开奖，2可以开奖，3活动已经开过奖
    if (survey.status === 1) {
      throw new Error("The event is not over yet.");
    }

    if (survey.status === 3) {
      throw new Error("The event is awarded.");
    }

    if (survey.type === '1') {
      this._randomBy(id, survey.number);
    } else if (survey.type === '2') {
      this._orderBy(id, survey.number);
    }

    this._updateSurveyStatus(id, 3);
  },
  endOf: function(id){
    if (!id) {
      throw new Error("id failed.");
    }
    var survey = this.surveies.get(id);
    var address = Blockchain.transaction.from;

    if(survey.auther !== address){
      throw new Error("auther failed.");
    }

    if(survey.balance !== 0){
      this._takeout(address, survey.balance, (value, from, to) => {
        this._minusAmount(value);
        this._updateSurveyBalance(value, id);
        this._updateSurveyStatus(id, 5);
      }, (error) => {
        throw new Error(error);
      });
      return;
    }

    this._updateSurveyStatus(id, 5);

  },
  _takeout: function(address, value, successCB, errorCB){
    if (!this._verifyAddress(address)) {
      if(typeof errorCB === 'function'){
        errorCB("address failed.");
      }
      return;
    }

    var result = Blockchain.transfer(address, value);

    //0 – 转移成功，1 – 转移失败
    if (!result) {
      if(typeof errorCB === 'function'){
        errorCB("transfer failed.");
      }
      return;
    }

    if(typeof successCB === 'function'){
      successCB(value, Blockchain.transaction.to, address);
    }

    Event.Trigger("TakeoutFailed", {
      Transfer: {
        from: Blockchain.transaction.to,
        to: address,
        value: value.toString()
      }
    });
  },
  _randomBy: function(surveyId, number) {
    var ids = this.surveyByAnswerIds.get(surveyId) || [];

    if (ids.length === 0) {
      return;
    }

    var winners = [];
    var random = -1;
    var id = '';
    var answer = null;
    var len = Math.min(number, ids.length);

    for (var i = 0; i < len; i++) {
      random = this._selectFrom(0, ids.length - 1);
      id = ids[random];
      answer = this.answers.get(id);
      if (answer) {
        winners.push({
          id: id,
          winner: answer.auther,
          winAmount: this._getWinnerAmount(surveyId),
          status: 1
        });
        ids.splice(random, 1);
        len--;
        i--;
      }
    }

    this.winners.put(surveyId, winners);
  },
  _orderBy: function(surveyId, number) {
    var ids = this.surveyByAnswerIds.get(surveyId) || [];

    if (ids.length === 0) {
      return;
    }

    var winners = [];
    var id = '';
    var answer = null;
    var len = Math.min(number, ids.length);

    for (var i = 0; i < len; i++) {
      id = ids[i];
      answer = this.answers.get(id);
      if (answer) {
        winners.push({
          id: id,
          winner: answer.auther,
          winAmount: this._getWinnerAmount(surveyId),
          status: 1
        });
      }
    }

    this.winners.put(surveyId, winners);
  },
  _getWinnerAmount: function(surveyId) {
    var survey = this.surveies.get(surveyId);
    if (!survey) {
      return 0;
    }
    return new BigNumber(survey.balance).div(survey.number);
  },
  _inWinners: function(auther, id) {
    var index = -1;
    var winners = this.winners.get(id) || [];

    for (var i = 0; i < winners.length; i++) {
      if (winners[i].winner === auther) {
        index = i;
      }
    }

    return index;
  },
  _updateSurveyStatus: function(id, status) {
    var survey = this.surveies.get(id);

    if(!survey || survey.status === status){
      return;
    }

    if (status) {
      survey.status = status;
    } else {
      if (new Date().getTime() >= survey.endTime && survey.status === 1) {
        survey.status = 2;
      }
    }
    this.surveies.put(id, survey);
  },
  _updateWinnerStatus: function(surveyId, answerId, status) {
    var winners = this.winners.get(surveyId) || [];
    var winner = null;
    for(var i = 0; i < winners.length; i++){
      winner = winners[i];
      if(winner && winner.id === answerId){
        winner.status = status;
        this.winners.put(surveyId, winners);
      }
    }  
  },
  _updateSurveyStatusByWinner: function(id) {
    var winners = this.winners.get(id) || [];
    var winner = null;
    var len = winners.length;

    for(var i = 0; i < winners.length; i++){
      winner = winners[i];
      if(winner && winner.status === 2){
        len--;
      }
    }

    if(len === 0){
      this._updateSurveyStatus(id, 4);
    }
  },
  _selectFrom: function(lowerValue, upperValue) {
    var choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
  },
  _verifyAddress: function(address) {
    return Blockchain.verifyAddress(address);
  },
  _saveQuestions: function(questions, surveyId) {
    if (!questions || questions.length === 0) {
      return;
    }

    var id = '';
    var question = null;
    var ids = this.surveyByQuestionIds.get(surveyId) || [];

    for (var i = 0; i < questions.length; i++) {
      id = this._guid();
      question = new Question(questions[i]);
      question.id = id;
      question.Acount = 0;
      question.Bcount = 0;
      question.Ccount = 0;
      question.Dcount = 0;
      this.questions.put(id, question);
      ids.push(id);
    }

    this.surveyByQuestionIds.put(surveyId, ids);
  },
  _plusAmount: function(amount) {
    var balance = new BigNumber(amount).mul(minUnit);
    this.amount = this.amount.plus(balance);
  },
  _minusAmount: function(amount) {
    var balance = new BigNumber(amount);
    this.amount = this.amount.minus(balance);
  },
  _updateSurveyBalance(amount, id){
    var survey = this.surveies.get(id);
    if(survey){
      survey.balance = new BigNumber(survey.balance).minus(amount);
      this.surveies.put(id, survey);
    }
  },
  _getQuestionsBySurveyId: function(id) {
    var questions = [];
    var ids = this.surveyByQuestionIds.get(id) || [];
    var question = null;
    for (var i = 0; i < ids.length; i++) {
      question = this.questions.get(ids[i]);
      if (question) {
        questions.push(question);
      }
    }
    return questions;
  },
  _getAnswersBySurveyId: function(id){
    var ids = this.surveyByAnswerIds.get(id) || [];
    var authers = [];
    var answer = null;
    for(var i = 0; i < ids.length; i++){
      answer = this.answers.get(ids[i]);
      if(answer){
        authers.push(answer);
      }
    }
    return authers;
  },
  _getWinnersBySurveyId: function(id){
    return this.winners.get(id) || [];
  },
  _updateRespondents: function(id) {
    var survey = this.surveies.get(id);
    if (!survey) {
      return;
    }
    survey.respondents += 1;
    this.surveies.put(id, survey);
  },
  _updateQuestionCounts: function(answers) {
    if (!answers || answers.length === 0) {
      return;
    }

    var id = '';
    var answer = null;
    var question = null;
    var key = '';

    for (var i = 0; i < answers.length; i++) {
      id = answers[i].id;
      answer = answers[i].answer;
      question = this.questions.get(id);
      key = answer + 'count';

      if (question.hasOwnProperty(key)) {
        question[key] += 1;
        this.questions.put(id, question);
      }
    }
  },
  _validate(form, topics) {
    if (!form.title) {
      return '主题不能为空';
    }

    if (Number(form.amount) === NaN) {
      return '奖金额度不能为空';
    }

    if (!form.type) {
      return '奖金发放形式不能为空';
    }

    if (form.type === '2' && !Number(form.minScore) === NaN) {
      return '分数不小于不能为空';
    }

    if (Number(form.number) === NaN) {
      return '中奖名额不能为空';
    }

    if (!form.startTime) {
      return '活动开始时间不能为空';
    }

    if (!form.endTime) {
      return '活动结束时间不能为空';
    }

    if (!form.content) {
      return '备注不能为空';
    }

    if (form.content.length > 200) {
      return '备注字数超过限制';
    }

    if (topics.length === 0) {
      return '请至少填写一个题目';
    }

    if (topics.length > 20) {
      return '您填写一个题目超过20，请删减';
    }

    for (var i = 0; i < topics.length; i++) {
      if (topics[i].optionsA === '') {
        return '题目' + (i + 1) + '至少填写一个选项';
      }
      if (form.type === '2' && topics[i].result === '') {
        return '题目' + (i + 1) + '未填写答案';
      }
    }

    return true;
  },
  _isAnswered(id) {
    var ids = this.surveyByAnswerIds.get(id) || [];
    var answer = null;
    for (var i = 0; i < ids.length; i++) {
      answer = this.answers.get(ids[i]);
      if (answer && (answer.auther === Blockchain.transaction.from)) {
        return true;
      }
    }
    return false;
  },
  _transformPageNumber: function(str) {
    var num = Number(str);
    return (num === NaN ? 0 : num) || pageNumber;
  },
  _transformPageSize: function(str) {
    var num = Number(str);
    return (num === NaN ? 0 : num) || pageSize;
  },
  _guid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

module.exports = QuestionnaireSurveyContract;