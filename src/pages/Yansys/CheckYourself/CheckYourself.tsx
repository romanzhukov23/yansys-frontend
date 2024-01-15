import {Checkbox, Submit, TextField} from "../../../shared/ui";
import {useState} from "react";
import {Radio} from "../../../shared/ui/forms/Radio";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";
import {Navigate} from "react-router-dom";
import {TextEditor} from "../../../shared/ui/forms/TextEditor";

function CheckYourself() {

	const setCheckbox = (i: number) => {
		let tempChecks: number[] = checks
		if (!tempChecks.includes(i)) tempChecks.push(i);
		// for (let j = 0; j < tempChecks.length; j++) {
		// 	if (j === i) {
		// 		tempChecks[j] = !tempChecks[j];
		// 	}
		// }

		if (i === 0) setCheck1(!check1)
		if (i === 1) setCheck2(!check2)
		if (i === 2) setCheck3(!check3)
		if (i === 3) setCheck4(!check4)
		if (i === 4) setCheck5(!check5)

		setChecks(tempChecks);
		console.log(checks);
	};

	const setVars1 = (i: number, newstr: string) => {
		let tempVars: string[] = []
		for (let j = 0; j < variants1.length; j++) {
			if (j !== i) {
				tempVars[j] = variants1[j];
			} else {
				tempVars[j] = newstr;
			}
		}
		setVariants1(tempVars);
	}

	const setVars2 = (i: number, newstr: string) => {
		let tempVars: string[] = []
		for (let j = 0; j < variants2Arr.length; j++) {
			if (j !== i) {
				tempVars[j] = variants2[j];
			} else {
				tempVars[j] = newstr;
			}
		}
		setVariants2(tempVars);
	}

	const setVars3 = (i: number, newstr: string) => {
		let tempVars: string[] = []
		for (let j = 0; j < variants3Arr.length; j++) {
			if (j !== i) {
				tempVars[j] = variants3[j];
			} else {
				tempVars[j] = newstr;
			}
		}
		setVariants3(tempVars);
	}

	const setQuestion = (i: number, newquest: string) => {
		let tempQuests: string[] = []
		for (let j = 0; j < questions.length; j++) {
			if (j !== i) {
				tempQuests[j] = questions[j];
			} else {
				tempQuests[j] = newquest;
			}
		}
		setQuestions(tempQuests);
	}

	const setAnswer = (i: number, newans: string) => {
		let tempAnss: string[] = []
		for (let j = 0; j < answers.length; j++) {
			if (j !== i) {
				tempAnss[j] = answers[j];
			} else {
				tempAnss[j] = newans;
			}
		}
		setAnswers(tempAnss);
	}

	let variants1Arr = [];
	for (let i = 1; i <= 4; i++) {
		let temp = localStorage.getItem(`variants1_${i}`);
		variants1Arr[i - 1] = temp != null ? temp : ' ';
	}

	let variants2Arr = [];
	for (let i = 1; i <= 4; i++) {
		let temp = localStorage.getItem(`variants2_${i}`);
		variants2Arr[i - 1] = temp != null ? temp : ' ';
	}

	let variants3Arr = [];
	for (let i = 1; i <= 5; i++) {
		let temp = localStorage.getItem(`variants3_${i}`);
		variants3Arr[i - 1] = temp != null ? temp : ' ';
	}

	let questionsArr = [];
	for (let i = 1; i <= 6; i++) {
		let temp = localStorage.getItem(`question${i}`);
		questionsArr[i - 1] = temp != null ? temp : ' ';
	}
	const [questions, setQuestions] = useState(questionsArr);

	let answersArr = [];
	for (let i = 1; i <= 6; i++) {
		let temp = localStorage.getItem(`answer${i}`);
		answersArr[i - 1] = temp != null ? temp : ' ';
	}

	const [answers, setAnswers] = useState(answersArr);

	const [variants1, setVariants1] = useState(variants1Arr);
	// const [variant11, setVariant11] = useState(variants1Arr[0]);
	// const [variant12, setVariant12] = useState(variants1Arr[1]);
	// const [variant13, setVariant13] = useState(variants1Arr[2]);
	// const [variant14, setVariant14] = useState(variants1Arr[3]);

	const [variants2, setVariants2] = useState(variants2Arr);
	// const [variant21, setVariant21] = useState(variants2Arr[0]);
	// const [variant22, setVariant22] = useState(variants2Arr[1]);
	// const [variant23, setVariant23] = useState(variants2Arr[2]);
	// const [variant24, setVariant24] = useState(variants2Arr[3]);

	const [variants3, setVariants3] = useState(variants3Arr);
	// const [variant31, setVariant31] = useState(variants3Arr[0]);
	// const [variant32, setVariant32] = useState(variants3Arr[1]);
	// const [variant33, setVariant33] = useState(variants3Arr[2]);
	// const [variant34, setVariant34] = useState(variants3Arr[3]);


	let checksArr = [false, false, false, false, false]
	const chars = ['0', '1', '2', '3', '4']
	for (let i = 0; i < answers[2].length; i++) {
		if (chars.includes(answers[2][i])) {
			checksArr[parseInt(answers[2][i])] = true;
		}
	}

	let cksArr: number[] = [  ]
	for (let i = 0; i < answers[2].length; i++) {
		if (chars.includes(answers[2][i])) {
			cksArr.push(parseInt(answers[2][i]));
		}
	}

	const [checks, setChecks] = useState(cksArr)
	const [check1, setCheck1] = useState(checksArr[0])
	const [check2, setCheck2] = useState(checksArr[1])
	const [check3, setCheck3] = useState(checksArr[2])
	const [check4, setCheck4] = useState(checksArr[3])
	const [check5, setCheck5] = useState(checksArr[4])

	const [marks, setMarks] = useState([0, 0, 0, 0, 0, 0]);


	const handleSubmitClick = (): void => {
		if (localStorage.getItem('role') === 'student') {
			const graphqlQuery = {
				"query": `mutation {checkAnswer (id: "${localStorage.getItem("id")}", answer1: "${answers[0]}", answer2: "${answers[1]}", answer3: [${check1}, ${check2}, ${check3}, ${check4}, ${check5}], answer4: "${answers[3]}", answer5: "${answers[4]}", answer6: "${answers[5]}")}`
			}

			axios.post(GRAPHQL_URL, graphqlQuery).then(r => {
				setMarks(r.data.data.checkAnswer)
			})
		} else {
			const graphqlQuery ={
				"query": `mutation {setQuestions (questions: { questions: ["${questions[0]}","${questions[1]}","${questions[2]}","${questions[3]}","${questions[4]}","${questions[5]}",] variants1: [${variants1.map(varia => `"${varia}"`)}] variants2: [${variants2.map(varia => `"${varia}"`)}] variants3: [${variants3.map(varia => `"${varia}"`)}] answer1: ${parseInt(answers[0])} answer2: ${parseInt(answers[1])} answer3: [${checks}] answer4: "${(answers[3])}" answer5: "${(answers[4])}" answer6: "${(answers[5])}" })}`
			}

			axios.post(GRAPHQL_URL, graphqlQuery).then(r => console.log(r.data.data));

			console.log(answers);
			console.log(checks);
			console.log(questions);
			console.log(variants1);
			console.log(variants2);
			console.log(variants3);
		}
	}


	if (localStorage.getItem('role') === 'student') {
		return (<div className='overflow-x-hidden mt-[3vh] flex flex-col justify-center items-center '>
			<div className='text-4xl'>Проверь себя</div>

			<div className='mt-[5vh] w-[80vw] text-xl'>
				<div>{questions[0]} {`${marks[0]} баллов из 1`}</div>
				<div className='ml-[2vw]'>
					{variants1.map((variant, index) =>
						<Radio onChange={(evt) => setAnswer(0, evt.target.value)} children={variant}
						       checked={answers[0] === index.toString()} name='radio1' value={index.toString()}/>)}
				</div>

				<div className='mt-[2vh]'>{questions[1]} {`${marks[1]} баллов из 1`}</div>
				<div className='ml-[2vw]'>
					{variants2.map((variant, index) =>
						<Radio onChange={(evt) => setAnswer(1, evt.target.value)} children={variant}
						       checked={answers[1] === index.toString()} name='radio2' value={index.toString()}/>)}
				</div>

				<div className='mt-[2vh]'>{questions[2]} {`${marks[2]} баллов из 5`}</div>
				<div className='ml-[2vw]'>
					<Checkbox onClick={(): void => setCheckbox(0)} checked={check1} children={variants3[0]}/>
					<Checkbox onClick={(): void => setCheckbox(1)} checked={check2} children={variants3[1]}/>
					<Checkbox onClick={(): void => setCheckbox(2)} checked={check3} children={variants3[2]}/>
					<Checkbox onClick={(): void => setCheckbox(3)} checked={check4} children={variants3[3]}/>
					<Checkbox onClick={(): void => setCheckbox(4)} checked={check5} children={variants3[4]}/>
				</div>

				<div className='mt-[2vh]'>
					<div>{questions[3]} {`${marks[3]} баллов из 2`}</div>
					<TextField onChange={(evt): void => setAnswer(3, evt.target.value)} value={answers[3]}></TextField>
				</div>
				<div className='mt-[2vh]'>
					<div>{questions[4]} {`${marks[4]} баллов из 2`}</div>
					<TextField onChange={(evt): void => setAnswer(4, evt.target.value)} value={answers[4]}></TextField>
				</div>
				<div className='mt-[2vh]'>
					<div>{questions[5]} {`${marks[5]} баллов из 2`}</div>
					<TextField onChange={(evt): void => setAnswer(5, evt.target.value)} value={answers[5]}></TextField>
				</div>
				<div className='my-[2vh] flex justify-center items-center'>
					<Submit color='bg-[#06b6d4]' onClick={handleSubmitClick} label='Сдать'></Submit>
				</div>
			</div>
		</div>)
	} else if (localStorage.getItem('role') === 'teacher') {
		return (<div className='overflow-x-hidden mt-[3vh] flex flex-col justify-center items-center '>
				<div className='text-4xl'>Проверь себя</div>
				<div className='mt-[5vh] w-[80vw] text-xl space-y-[2vh]'>

					{/* 1 QUESTION */}
					<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(0, evt.target.value)}
					            value={questions[0] != null ? questions[0] : ''}/>
					<div className='ml-[2vw] flex flex-col space-y-[1vh]'>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(0, evt.target.value)} checked={answers[0] === '0'}
							       name='radio1' value='0'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars1(0, evt.target.value)}
							            value={variants1[0]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(0, evt.target.value)} checked={answers[0] === '1'}
							       name='radio1' value='1'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars1(1, evt.target.value)}
							            value={variants1[1]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(0, evt.target.value)} checked={answers[0] === '2'}
							       name='radio1' value='2'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars1(2, evt.target.value)}
							            value={variants1[2]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(0, evt.target.value)} checked={answers[0] === '3'}
							       name='radio1' value='3'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars1(3, evt.target.value)}
							            value={variants1[3]}/>
						</div>
					</div>

					{/* 2 QUESTION */}
					<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(1, evt.target.value)}
					            value={questions[1] != null ? questions[1] : ''}/>
					<div className='ml-[2vw] flex flex-col space-y-[1vh]'>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(1, evt.target.value)} checked={answers[1] === '0'}
							       name='radio2' value='0'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars2(0, evt.target.value)}
							            value={variants2[0]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(1, evt.target.value)} checked={answers[1] === '1'}
							       name='radio2' value='1'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars2(1, evt.target.value)}
							            value={variants2[1]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(1, evt.target.value)} checked={answers[1] === '2'}
							       name='radio2' value='2'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars2(2, evt.target.value)}
							            value={variants2[2]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Radio onChange={(evt) => setAnswer(1, evt.target.value)} checked={answers[1] === '3'}
							       name='radio2' value='3'/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars2(3, evt.target.value)}
							            value={variants2[3]}/>
						</div>
					</div>

					{/* 3 QUESTION */}
					<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(2, evt.target.value)}
					            value={questions[2] != null ? questions[2] : ''}/>
					<div className='ml-[2vw] flex flex-col space-y-[1vh]'>
						<div className='flex flex-row space-x-[1vw]'>
							<Checkbox onClick={(): void => setCheckbox(0)} checked={check1}/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars3(0, evt.target.value)}
							            value={variants3[0]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Checkbox onClick={(): void => setCheckbox(1)} checked={check2}/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars3(1, evt.target.value)}
							            value={variants3[1]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Checkbox onClick={(): void => setCheckbox(2)} checked={check3}/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars3(2, evt.target.value)}
							            value={variants3[2]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Checkbox onClick={(): void => setCheckbox(3)} checked={check4}/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars3(3, evt.target.value)}
							            value={variants3[3]}/>
						</div>
						<div className='flex flex-row space-x-[1vw]'>
							<Checkbox onClick={(): void => setCheckbox(4)} checked={check5}/>
							<TextEditor className='h-[5vh] w-[40vw]' onChange={(evt): void => setVars3(4, evt.target.value)}
							            value={variants3[4]}/>
						</div>
					</div>

					{/* 4-6 QUESTION */}
						<div className='flex flex-col space-y-[1vh]'>
							<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(3, evt.target.value)}
							            value={questions[3] === null ? ' ' : questions[3]}/>
							<TextEditor className='h-[6vh] ml-[2vw]' onChange={(evt): void => setAnswer(3, evt.target.value)}
							            value={answers[3] === null ? ' ' : answers[3]}/>
						</div>
					<div className='flex flex-col space-y-[1vh]'>
						<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(4, evt.target.value)}
						            value={questions[4] === null ? ' ' : questions[4]}/>
						<TextEditor className='h-[6vh] ml-[2vw]' onChange={(evt): void => setAnswer(4, evt.target.value)}
						            value={answers[4] === null ? ' ' : answers[4]}/>
					</div>
					<div className='flex flex-col space-y-[1vh]'>
						<TextEditor className='h-[8vh] w-[78vw]' onChange={(evt): void => setQuestion(5, evt.target.value)}
						            value={questions[5] === null ? ' ' : questions[5]}/>
						<TextEditor className='h-[6vh] ml-[2vw]' onChange={(evt): void => setAnswer(5, evt.target.value)}
						            value={answers[5] === null ? ' ' : answers[5]}/>
					</div>
				</div>

				<div className='my-[2vh] flex justify-center items-center'>
					<Submit color='bg-[#06b6d4]' onClick={handleSubmitClick} label='Сдать'></Submit>
				</div>
			</div>
		)
	} else {
		return (<Navigate to='/login'/>)
	}
}

export {CheckYourself}