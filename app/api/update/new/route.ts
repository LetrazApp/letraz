import {NextResponse} from 'next/server'
import {getPosts} from '@/lib/posts.method'
import {defaultUrl, discordBlogUrl} from '@/config'
import TurndownService from 'turndown'

export const POST = async () => {
	try {
		const post = (await getPosts())[0]
		const turndownService = new TurndownService()
		const response = await fetch(`${discordBlogUrl}/main/announcement`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.DISCORD_BOD_TOKEN}`
			},
			body: JSON.stringify({
				image_url: post.feature_image,
				title: post.title,
				message_content: turndownService.turndown(post.html),
				learn_more: `${defaultUrl}/changes`
			})
		})
		return NextResponse.json({message: 'Success'})
	} catch (error: any) {
		return NextResponse.json({message: 'Failed'})
	}
}
