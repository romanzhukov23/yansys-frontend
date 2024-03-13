import React, {Dispatch, SetStateAction} from 'react';
import {TextField} from "./TextField";

export const LoginTextField = ({state, setState, label}: {state: string, setState: Dispatch<SetStateAction<string>>, label: string}) => {
	return (
		<div>
			<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
				{label}
			</label>
			<TextField
				className='mb-[1.5vh]'
				onChange={(evt): void => setState(evt.target.value)} value={state}/>
		</div>
	);
};
