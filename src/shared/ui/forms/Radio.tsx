interface RadioProps {
	onChange: (evt: any) => void;
	checked: boolean;
	name: string
	value: string
	children?: string;
	className?: string;
	right?: number
}

export function Radio({className, onChange, checked, children, name, value, right}: RadioProps): JSX.Element {
	return <div className={`${className} flex flex-row items-center`}>
		<input className={`checked:bg-[#1fd2e3] checked:text-[#1fd2e3] ${right === 1 ? "accent-green-500" : right === 0 ? "accent-red-500" : ""}`} type='radio' name={name} value={value}
		       checked={checked}
		       onChange={onChange}/>
		<label className='ml-1.5'>{children}</label>
	</div>
}