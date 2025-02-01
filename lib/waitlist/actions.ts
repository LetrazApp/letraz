'use server'

import {Resend} from 'resend'
import WaitlistWelcomeEmail from '@/emails/welcome'
import {WaitlistMutationSchema} from '@/lib/waitlist/types'


const resend = new Resend(process.env.RESEND_API_KEY)

export const signUpForWaitlist = async (email: string, referrer?: any) => {
	const params = WaitlistMutationSchema.parse({email, referrer})

	const response = await fetch(`${process.env.API_URL}/waitlist/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			...params
		})
	})

	if (!response.ok) {
		console.log('DUPLICATE ENTRY')
		const data = await response.json()
		console.log(data.error.details)
		return params
	}

	await resend.emails.send({
		from: 'Subhajit from Letraz <subhajit@letraz.app>',
		replyTo: 'Subhajit from Letraz <subhajit@letraz.app>',
		to: params.email,
		subject: 'Welcome to Letraz waitlist!',
		react: WaitlistWelcomeEmail()
	})

	return WaitlistMutationSchema.parse(await response.json())
}
