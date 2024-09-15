import {Metadata} from 'next'

export const metadata: Metadata = {
	title: 'Letraz — Craft unique resumes for each job application effortlessly',
	description: 'Create tailored resumes for every job application effortlessly with Letraz. Our AI-powered tool ' +
		'helps you stand out by automatically optimizing your resume for ATS and recruiters, ensuring your skills ' +
		'and experience match the job\'s requirements. No more generic resumes—Letraz makes every application count.',
	openGraph: {
		title: 'Letraz — Effortless, Tailored Resumes for Every Job Application',
		description: 'Letraz automates resume creation to match every job\'s requirements, giving job seekers a ' +
			'higher chance of being noticed by ATS and recruiters. Customize your resume with ease!',
	}
}

const LandingPage = () => {
	return (
		<main className="h-screen overflow-hidden flex justify-center items-center">
			<video autoPlay muted loop poster="/banner.png" className="aspect-video">
				<source src="/letraz-intro.mp4" type="video/mp4"/>
				Your browser does not support the video tag. You can <a href="/letraz-intro.mp4">download the video</a> instead.
			</video>
			<h1 className="sr-only">Craft Unique Resumes Tailored to Every Job Application</h1>
		</main>
	)
}

export default LandingPage
