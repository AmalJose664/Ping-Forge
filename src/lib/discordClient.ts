import { REST } from "@discordjs/rest"
import {
	RESTPostAPIChannelMessageResult,
	RESTPostAPICurrentUserCreateDMChannelResult,
	Routes,
	APIEmbed,
} from "discord-api-types/v10"

export class DiscordClient {
	private rest: REST

	constructor(token: string | undefined) {
		this.rest = new REST({ version: "10" }).setToken(token ?? "")
	}

	async createDm(
		userId: string
	): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
		return this.rest.post(Routes.userChannels(), {
			body: { recipient_id: userId },
		}) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>
	}
	async sendEmbed(
		channelId: string,
		embed: APIEmbed
	): Promise<RESTPostAPIChannelMessageResult> {
		return this.rest.post(Routes.channelMessages(channelId), {
			body: { embeds: [embed] },
		}) as Promise<RESTPostAPIChannelMessageResult>
	}
	async sendNiceEmbed(
		channelId: string,
		embed: APIEmbed
	)
		: Promise<RESTPostAPIChannelMessageResult> {
		console.log(embed, "\n\n-----------------------------------------------------------------------------------------\n")
		//return { embeds: "" }
		return this.rest.post(Routes.channelMessages(channelId), {
			body: { embeds: [embed] },
		}) as Promise<RESTPostAPIChannelMessageResult>
	}
	async sendTest( // mainly for testing codes
		channelId: string
	): Promise<RESTPostAPIChannelMessageResult> {
		const embed = {
			title: "Hello ~~people~~ world :wave:",
			description:
				"You can use [links](https://discord.com) or emojis :smile: 😎\n```\nAnd also code blocks\n```",
			color: 4321431,
			timestamp: "2022-07-03T18:07:18.372Z",
			url: "https://discord.com",
			author: {
				name: "Author name",
				url: "https://discord.com",
				icon_url: "https://unsplash.it/100",
			},
			thumbnail: {
				url: "https://unsplash.it/200",
			},
			provider: { name: "AmalTony", url: "https://help.js" },
			image: {
				url: "https://unsplash.it/380/200",
				width: 400,
				height: 600,
			},
			footer: {
				text: "Footer text",
				icon_url: "https://unsplash.it/100",
			},
			fields: [
				{
					name: "Field 1, *lorem* **ipsum**, ~~dolor~~",
					value: "Field value",
				},
				{
					name: "Field 2",
					value: "You can use custom emojis <:Kekwlaugh:722088222766923847>. <:GangstaBlob:742256196295065661>",
					inline: false,
				},
				{
					name: "Inline field",
					value: "Fields can be inline",
					inline: true,
				},
				{
					name: "Inline field",
					value: "*Lorem ipsum*",
					inline: true,
				},
				{
					name: "Inline field",
					value: "value",
					inline: true,
				},
				{
					name: "Another field",
					value: "> Nope, didn't forget about this",
					inline: false,
				},
			],
		}

		return this.rest.post(Routes.channelMessages(channelId), {
			body: {
				embeds: [embed],
			},
		}) as Promise<RESTPostAPIChannelMessageResult>
	}
}
