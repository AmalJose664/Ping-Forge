import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const parseColor = (color: string) => {
    const hex = color.startsWith("#") ? color.slice(1) : color

    return parseInt(hex, 16)
}

export const codeSnippets = {
    simpleCode: {
        complete: `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: '<category_name>',
	description: "Some event description",
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`,
        fields: `fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
	  untrack_field2: 'value2' // for example: Any untracking field and value
	  untrack_field2: 'value2' // for example: Any untracking field and value
    }`,
    },
}
