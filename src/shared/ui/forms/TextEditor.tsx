import {ChangeEventHandler} from "react";

interface TextEditorProps {
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
	value: string;
	defaultValue?: string
	className?: string
}

export function TextEditor({onChange, value, className, defaultValue}: TextEditorProps): JSX.Element {
	return <textarea
		className={`flex flex-col border border-black rounded-[4px] p-[5px] bg-[#D9D9D933] ${(className != null) ? className : ''}`}
		value={value} onChange={onChange} required defaultValue={defaultValue}/>;
}
