import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors=[
  "bg-[#0077b6] text-white border-[1px] border-[#138dcf]",
  "bg-[#00b4d8] text-white border-[1px] border-[#82dbed]",
  "bg-[#003566] text-white border-[1px] border-[#0264bf]",
  "bg-[#00afb9] text-white border-[1px] border-[#45a8ad]"
]

export const getColor=(color)=>{
  if(color>=0 && color<colors.length)
  {
    return colors[color]
  }
  return colors[0]
}