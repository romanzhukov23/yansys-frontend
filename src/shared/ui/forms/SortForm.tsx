import {TextField} from "./TextField";
import {Filters, SearchFilters} from "../../types";
import {Dispatch, SetStateAction} from "react";

type SortFormProps = {
	indicatorsLoading: boolean,
	instrument: string,
	setInstrument: Dispatch<SetStateAction<string>>
	filters: Filters[],
	searchFilters: SearchFilters[],
	setSF: Function,
}

export const SortForm = ({indicatorsLoading, instrument, setInstrument, filters, searchFilters, setSF}: SortFormProps) => {
	return (<div className='flex gap-[2vh] w-[19vw] flex-col bg-gray-200 p-3 rounded-xl shadow-2xl'>
		<h1 className='text-xl'>Поиск по инструменту</h1>
		<TextField className='p-2' text='2xl' height='[5vh]' width='[12vw]'
		           onChange={(evt): void => setInstrument(evt.target.value)} value={instrument}/>

		<h1 className='text-xl'>Поиск по фильтрам</h1>
		{indicatorsLoading ? <div>Загрузка...</div> : <div>
			{filters.map((f, index) => <div className='py-3 flex items-center gap-2'>
				<p className='text-lg w-[2vw] mr-0.5'>{f.title}</p>
				<div className='flex gap-2 ml-auto items-center'>
					<TextField className='p-1' text='base' width='[6vw]' onChange={(evt): void => {
						setSF(evt.target.value, index, 'min');
						console.log(evt.target.value)
					}}
					           placeholder={f.min !== null ? f.min : '0'}
					           value={parseFloat(searchFilters[index].min).toFixed(2).toString()}/>
					<p className='text-base'>—</p>
					<TextField className='p-1' text='base' width='[6vw]' onChange={(evt): void => {
						setSF(evt.target.value, index, 'max');
						console.log(evt.target.value)
					}}
					           placeholder={f.max} value={parseFloat(searchFilters[index].max).toFixed(2).toString()}/>
				</div>
			</div>)}
		</div>}
	</div>)
}