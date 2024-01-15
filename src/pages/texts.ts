import axios from "axios";
import {GRAPHQL_URL} from "./URL";

export let texts: { id: number, text: string }[] = []
export let questions: {questions: string[],	variants1: string[], variants2: string[],	variants3: string[],
												answer1: number, answer2: number, answer3: number[], answer4: string, answer5: string, answer6: string} = {
	answer1: 0, answer2: 0, answer3: [], answer4: "", answer5: "", answer6: "",
	questions: [],
	variants1: [],
	variants2: [],
	variants3: []
}

export function f() {
	const getTextQuery = {
		"query": "query {getText { id text }}"
	}

	if (localStorage.getItem('role') === 'teacher') {
		const getQuestionsQuery = {
			"query": "query {getQuestions { answer1 answer2 answer3 answer4 answer5 answer6 questions variants1 variants2 variants3 }}"
		}

		axios.post(GRAPHQL_URL, getQuestionsQuery).then(r => {
			questions = r.data.data.getQuestions;
			const anss = [questions.answer1, questions.answer2, questions.answer3, questions.answer4, questions.answer5, questions.answer6]
			for (let i = 1; i <= questions.questions.length; i++) {
				localStorage.setItem(`question${i}`, questions.questions[i-1]);
			}
			for (let i = 1; i <= questions.variants1.length; i++) {
				localStorage.setItem(`variants1_${i}`, questions.variants1[i-1]);
			}
			for (let i = 1; i <= questions.variants2.length; i++) {
				localStorage.setItem(`variants2_${i}`, questions.variants2[i-1]);
			}
			for (let i = 1; i <= questions.variants3.length; i++) {
				localStorage.setItem(`variants3_${i}`, questions.variants3[i-1]);
			}
			for (let i = 0; i < anss.length; i++) {
				localStorage.setItem(`answer${i+1}`, anss[i] as string)
			}

			console.log('questions upload');
		})
	} else {
		const getQuestionsQuery = {
			"query": "query {getQuestions { questions variants1 variants2 variants3 }}"
		}

		axios.post(GRAPHQL_URL, getQuestionsQuery).then(r => {
			questions = r.data.data.getQuestions;
			for (let i = 1; i <= questions.questions.length; i++) {
				localStorage.setItem(`question${i}`, questions.questions[i-1]);
			}
			for (let i = 1; i <= questions.variants1.length; i++) {
				localStorage.setItem(`variants1_${i}`, questions.variants1[i-1]);
			}
			for (let i = 1; i <= questions.variants2.length; i++) {
				localStorage.setItem(`variants2_${i}`, questions.variants2[i-1]);
			}
			for (let i = 1; i <= questions.variants3.length; i++) {
				localStorage.setItem(`variants3_${i}`, questions.variants3[i-1]);
			}
			console.log('questions upload');
		})
	}

	axios.post(GRAPHQL_URL, getTextQuery).then(r => {
		texts = r.data.data.getText;
		for (let i = 0; i < texts.length; i++) {
			console.log(texts[i]);
			localStorage.setItem(`text${texts[i].id}`, texts[i].text);
			console.log(localStorage.getItem(`text${texts[i].id}`));
		}
		console.log('texts upload');
	})
}
