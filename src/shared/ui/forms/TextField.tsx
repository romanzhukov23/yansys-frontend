import {ChangeEventHandler} from "react";

interface TextFieldProps {
	onChange: ChangeEventHandler<HTMLInputElement>;
	value: string;
	type?: string
	placeholder?: string
	className?: string
	width?: string
	height?: string
	text?: string
}

export function TextField({onChange, value, type, placeholder, className, width, height, text}: TextFieldProps): JSX.Element {
	return <input
		className={`${text != null ? `text-${text}` : ''} flex flex-col border border-black rounded-[4px] h-${height != null ? height : '[4vh]'} w-${width != null ? width : '[12vw]'} bg-[#D9D9D933] ${(className != null) ? className : ''}`}
		value={value} onChange={onChange} required type={type} placeholder={placeholder}/>;
}
