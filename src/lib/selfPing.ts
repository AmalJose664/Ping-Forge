

type SelfPing = ({ email, name }: { email: string, name: string }) => void | Promise<void>


export const selfPing: SelfPing = async ({ email, name }) => {

	const apiKey = process.env.MY_API_KEY!
	const url = process.env.NEXT_PUBLIC_APP_URL!
	if (!url || !apiKey) {
		console.log(" No api key or url found return")
		return
	}
	const body = JSON.stringify({
		category: 'pingpanda',
		description: "new user from ping panda",
		fields: {
			email,
			name,
			date: new Date().toISOString().split("T")[0]
		}
	})
	console.log(url, apiKey, body)
	fetch(url + "/api/v1/events", {
		method: 'POST',
		headers: {
			Authorization: "Bearer " + apiKey
		},
		body
	})
	// const data = await response.json()
	// console.log("new User sign data =", data)

}