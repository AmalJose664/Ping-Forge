import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const parseColor = (color: string) => {
    const hex = color.startsWith("#") ? color.slice(1) : color

    return parseInt(hex, 16)
}
// utils/authErrors.ts
export const authErrorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked with another account. Please sign in with the original provider.",
  CredentialsSignin: "Invalid credentials. Please try again.",
  AccessDenied: "Access denied. Contact support if you think this is a mistake.",
  default: "Something went wrong. Please try again."
};


export const codeSnippets = {
    simpleCode: {
		generateCodeForCategory(category:string){
			return `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
    category: "${category}",
	description: "Some event description",
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`
		},
        complete: `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
    category: <VALID_CATEGORY_NAME>,
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
	  untrack_field1: 'value1' // for example: Any untracking field and value => untrack_name: ""
	  untrack_field2: 'value2' // for example: Any untracking field and value  => untrack_count: 20
    }`,
    },

    detailedCode: {
        simple: `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v2/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
  {
  category: <VALID_CATEGORY_NAME>,
  description: "some descrition",
  iconAvatar: "https://thumbnail.avatar.img/example.jpg",
  fields: {
    field1: 'value1', // for example: user id ...
  },
  outline: {
    field1: 'value1', // for example: user id ...
  },
   footer: {
    text: "Footer Text",
	}
  `,
        complete: `await fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/v2/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
  {
  category: <VALID_CATEGORY_NAME>,
  description: "some description", // use # to change text size # description, ## description,  ### description
  codeSnippet: "const x = 0",
  iconAvatar: "https://thumbnail.avatar.img/example.jpg",
  imageBg: "https://thumbnail.avatar.img/example.jpg",
  fields: {
    field1: 'value1', // for example: user id
    field2: 'value2' // for example: user email
  },
  outline: {
    field1: 'value1', // for example: user id
    field2: 'value2' // for example: user email
  },
  url: "https://your-app.link/",
  author: {
    name: "author",
    icon_url: "https://author.avatar.img/example.jpg"
  },
  footer: {
    text: "Footer Text",
    icon_url: "https://footer.avatar.img/example.jpg"
  }
}`,
        fields: `fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
	  untrack_field1: 'value2' // for example: Any untracking field and value => untrack_name: ""
	  untrack_field2: 'value2' // for example: Any untracking field and value => untrack_count: 20
    }`,
        outline: `outline:{
    field1: 'value1', // for example: user id
    field2: 'value2' // for example: user email
  },`,
        extraFields: `codeSnippet: "const x = 0", // custom code snippets
iconAvatar: "https://thumbnail.avatar.img/example.jpg", // icon or image
imageBg: "https://thumbnail.avatar.img/example.jpg", // image
footer: {
	text: "Footer Text", // footer text
	icon_url: "https://footer.avatar.img/example.jpg" //footer image or icon
}
author: {
	name: "author", // author
	icon_url: "https://author.avatar.img/example.jpg" // Author avatar or icon
},
url: "https://your-app.link/" //category href || title link`,
    },
}
