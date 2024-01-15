import {PropsWithChildren} from "react";

interface SubmitProps {
	onClick: (() => void);
	label?: string
	className?: string
	color?: string
}

export function Submit({onClick, label, className, color, children}: PropsWithChildren<SubmitProps>): JSX.Element {
	return <button className={`self-center flex items-center justify-center ${color} ${className != null ? className : ' rounded-[20px] h-[8vh] w-[10vw] font-[600] font-[inter] text-white text-[25px] line-[30px]'} border-0`}
	               onClick={onClick} type='submit'>
		{label}
		{children}
	</button>
}