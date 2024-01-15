import {SetStateAction, useCallback, useState} from "react"
import {debounce} from 'lodash'

const useDebounce = (value: any, delay: number) => {
	const [current, setCurrent] = useState()
	const update = useCallback<any>(debounce((v: SetStateAction<undefined>) => setCurrent(v), delay), [])

  update(value)
  return current
}

export const Textbox = () => {
  const [value, setValue] = useState('')

  const result = useDebounce(value, 1000)

  return <input className="border border-black rounded-[4px] h-[5vh] w-[15vw] bg-[#D9D9D933]" onChange={e => setValue(e.target.value)}/>
}