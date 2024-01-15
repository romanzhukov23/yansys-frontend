import {Navigate} from "react-router-dom";
import {useState} from "react";
import {TextEditor} from "../../../shared/ui/forms/TextEditor";
import {Submit} from "../../../shared/ui";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";

export function TheoryStudy() {
	const [divs] = useState([
		localStorage.getItem('text1') != null ? localStorage.getItem('text1') : ' ',
		localStorage.getItem('text2') != null ? localStorage.getItem('text2') : ' ',
		localStorage.getItem('text3') != null ? localStorage.getItem('text3') : ' ',
		localStorage.getItem('text4') != null ? localStorage.getItem('text4') : ' ',
		localStorage.getItem('text5') != null ? localStorage.getItem('text5') : ' ',
		localStorage.getItem('text6') != null ? localStorage.getItem('text6') : ' ',
		localStorage.getItem('text7') != null ? localStorage.getItem('text7') : ' ',
		localStorage.getItem('text8') != null ? localStorage.getItem('text8') : ' ',
	]);

	const [value1, setValue1] = useState(divs[0])
	const [value2, setValue2] = useState(divs[1])
	const [value3, setValue3] = useState(divs[2])
	const [value4, setValue4] = useState(divs[3])
	const [value5, setValue5] = useState(divs[4])
	const [value6, setValue6] = useState(divs[5])
	const [value7, setValue7] = useState(divs[6])
	const [value8, setValue8] = useState(divs[7])

	const handleLoginClick = (): void => {
		console.log(value1, value2, value3, value4, value5, value6, value7, value8);

		const graphqlQuery = {
			"query": `mutation {setText (
				divs: [{
		        id: 1, 
		        text: "${value1}"
		      }, {
		        id: 2,
		        text: "${value2}"
		      }, {
		        id: 3, 
		        text: "${value3}"
		      }, {
		        id: 4,
		        text: "${value4}"
		      }, {
		        id: 5, 
		        text: "${value5}"
		      }, {
		        id: 6,
		        text: "${value6}"
		      }, {
		        id: 7, 
		        text: "${value7}"
		      }, {
		        id: 8,
		        text: "${value8}"
		      }])}`
		}


		axios.post(GRAPHQL_URL, graphqlQuery).then(r => {
			console.log(r.data.data.setText)
		})
	};

	if (localStorage.getItem('role') === 'student') {
		return (<div className='mt-[3vh] flex flex-col justify-center items-center '>
			<div className="animate-[wiggle_1s_ease-in-out_infinite]">
			</div>
			<div className='text-4xl'>Изучение Теории</div>
			<div className='w-[80vw]'>
				<iframe className='mt-[2vh]' width="560" height="315" src="https://www.youtube-nocookie.com/embed/P3iYjCx3HQ8"
				        title="YouTube video player" frameBorder="0"
				        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				        allowFullScreen></iframe>
				<img className='h-[30.4vw] w-[40vw]' src="/images/theory-img.jpg" alt="theory-img"/>
				<div>
					<div className='text-2xl'>Способы заражения компьютера</div>
					<div className='flex flex-col justify-center m-[20px] gap-4 text-lg'>
						{divs.map((d, index) => (<div id={(index+1).toString()}>{d}</div>))}
					</div>
				</div>
				<img src="/images/giphy.gif" alt="gif"/>
			</div>
		</div>)
	} else if (localStorage.getItem('role') === 'teacher') {
		return (<div className='mt-[3vh] flex flex-col justify-center items-center '>
			<div className="animate-[wiggle_1s_ease-in-out_infinite]">
			</div>
			<div className='text-4xl'>Изучение Теории</div>
			<div className='w-[80vw]'>
				<div>
					<div className='my-[2vh] text-2xl'>Способы заражения компьютера</div>
					<div className='flex flex-col justify-center m-[20px] gap-4 text-lg'>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue1(evt.target.value)} value={value1 != null ? value1 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue2(evt.target.value)} value={value2 != null ? value2 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue3(evt.target.value)} value={value3 != null ? value3 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue4(evt.target.value)} value={value4 != null ? value4 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue5(evt.target.value)} value={value5 != null ? value5 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue6(evt.target.value)} value={value6 != null ? value6 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue7(evt.target.value)} value={value7 != null ? value7 : ''}/>
						<TextEditor className='h-[25vh] w-[78vw]' onChange={(evt): void => setValue8(evt.target.value)} value={value8 != null ? value8 : ''}/>
					</div>
				</div>
				<div className='m-[2vh] flex justify-center'><Submit color='bg-[#06b6d4]' onClick={handleLoginClick} label='Сохранить'/></div>
			</div>
		</div>)
	} else {
		return (<Navigate to='/login'/>)
	}
}