

type SelfPing = ({ email, name }: { email: string, name: string, pic: string }) => void | Promise<void>


export const selfPing: SelfPing = async ({ email, name, pic }) => {

	const apiKey = process.env.MY_API_KEY!
	const url = process.env.NEXT_PUBLIC_APP_URL!
	if (!url || !apiKey) {
		console.log(" No api key or url found return")
		return
	}
	const body = JSON.stringify({
		category: process.env.NODE_ENV === "production" ? "ping-forge-pro" : 'ping-forge',
		description: "New user signup on Ping Forge",
		iconAvatar: pic,
		fields: {
			email,
			name,
			date: new Date().toISOString().split("T")[0]
		},
		url: process.env.NEXT_PUBLIC_APP_URL
	})
	fetch(url + "/api/v2/events", {
		method: 'POST',
		headers: {
			Authorization: "Bearer " + apiKey
		},
		body
	})
	console.log("Telemetry..........||")
	// const data = await response.json()
	// console.log("new User sign data =", data)

}