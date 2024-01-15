import {MouseEventHandler} from "react";

interface CheckboxProps {
	onClick: MouseEventHandler<HTMLDivElement>;
	checked: boolean;
	className?: string;
	children?: string;
}

export function Checkbox({className, onClick, checked, children}: CheckboxProps): JSX.Element {
	return <div className={`${className} flex flex-row items-center`}>
		<div onClick={onClick} className={`h-[20px] w-[20px] items-center justify-center border-2 rounded-[4px] ${checked ? 'bg-[#06b6d4]' : 'bg-white'}`} />
		<label className='ml-1.5'>{children}</label>
	</div>
}