const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

const db = require("../../../../config/pgsql");
const { getJwtToken, generateOTP } = require("../../../../common/common");

class providerService {
  getQuestionPaper(body) {
    return new Promise(async (resolve, reject) => {
      try {
        let {} = body;

        const table = `"question"`;
        const selectParams = `
          "question",
          "subject",
          "topic",
          "difficulty",
          "marks"`;

        const where1 = `difficulty = 'Easy'`;
        const where2 = `difficulty = 'Medium'`;
        const where3 = `difficulty = 'Hard'`;

        let paper1 = await db.select(table, selectParams, where1);
        let paper2 = await db.select(table, selectParams, where2);
        let paper3 = await db.select(table, selectParams, where3);

        if (!paper1.length || !paper2.length || !paper3.length) {
          throw {
            message: "QUESTION_NOT_FOUND",
            statusCode: 403,
          };
        }

        let easytotalMarks = 0;
        let easyQuestions = [];
        let mediumtotalMarks = 0;
        let mediumQuestions = [];
        let hardtotalMarks = 0;
        let hardQuestions = [];

        function selectQuestions(
          paper,
          targetMarks,
          questionsArray,
          totalMarks
        ) {
          while (totalMarks < targetMarks) {
            let randomIndex = Math.floor(Math.random() * paper.length);
            let selectedQuestion = paper[randomIndex];

            questionsArray.push({
              question: selectedQuestion.question,
              subject: selectedQuestion.subject,
              topic: selectedQuestion.topic,
              difficulty: selectedQuestion.difficulty,
              marks: selectedQuestion.marks,
            });

            totalMarks += selectedQuestion.marks;

            paper.splice(randomIndex, 1);
          }
        }

        selectQuestions(paper1, 20, easyQuestions, easytotalMarks);

        selectQuestions(paper2, 50, mediumQuestions, mediumtotalMarks);

        selectQuestions(paper3, 30, hardQuestions, hardtotalMarks);

        let finalArray = easyQuestions.concat(mediumQuestions, hardQuestions);
        return resolve({
          finalArray,
          totalMarks: easytotalMarks + mediumtotalMarks + hardtotalMarks,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}

module.exports = new providerService();
