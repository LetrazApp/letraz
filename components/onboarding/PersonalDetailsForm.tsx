'use client'

import {motion} from 'motion/react'
import {cn} from '@/lib/utils'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Link, useTransitionRouter} from 'next-view-transitions'
import {ChevronLeft, ChevronRight, Loader2} from 'lucide-react'
import {OnboardingFormInput} from '@/components/onboarding/OnboardingFormInput'
import {toast} from 'sonner'
import {addOrUpdateUserInfoToDB} from '@/lib/user-info/actions'
import {UserInfoMutation, UserInfoMutationSchema} from '@/lib/user-info/types'
import {JSX} from 'react'

// Define the default values for the form
type DefaultValues = {
	first_name: string
	last_name: string
	email: string
	phone?: string
}

/**
 * PersonalDetails component handles the form for adding user's profile details.
 *
 * @param {DefaultValues} props - The default values object.
 * @param {string} [props.className] - Additional class names for styling.
 * @returns {JSX.Element} The JSX code to render the education form.
 */
const PersonalDetailsForm = ({className, defaultValues}: { className?: string, defaultValues: DefaultValues }): JSX.Element => {
	const router = useTransitionRouter()

	// Initialize the form with default values and validation schema
	const form = useForm<UserInfoMutation>({
		resolver: zodResolver(UserInfoMutationSchema),
		defaultValues: {
			first_name: defaultValues.first_name,
			last_name: defaultValues.last_name,
			email: defaultValues.email,
			phone: defaultValues.phone || undefined
		}
	})

	/**
	 * Function to submit user's profile details to the backend.
	 *
	 * @param {UserInfoMutation} values - The form values.
	 */
	const onSubmit = async (values: UserInfoMutation) => {
		try {
			await addOrUpdateUserInfoToDB({
				...values
			})
			router.push('/app/onboarding?step=education')
		} catch (error) {
			toast.error('Failed to update information, please try again')
		}
	}

	return (
		<div className={cn('max-w-4xl mx-auto flex flex-col items-center', className)}>
			<motion.div
				className="text-xl text-center mt-8 max-w-xl"
				initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2, duration: 0.7}}
			>
				<p>We need a few details about you to craft the perfect resume for you</p>
			</motion.div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-20 space-y-8"
				>
					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between" >
						<FormField
							control={form.control}
							name="first_name"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="first name" {...field} autoFocus />
									<FormLabel className="transition">First name</FormLabel>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="last_name"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="last name" {...field} />
									<FormLabel className="transition">Last name</FormLabel>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</motion.div>

					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between" >
						<FormField
							control={form.control}
							name="email"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="email address" {...field} />
									<FormLabel className="transition">Email</FormLabel>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="phone no." {...field} value={field.value || ''} />
									<FormLabel className="transition">Phone (optional)</FormLabel>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</motion.div>

					<div
						className="w-[calc(100%-4.7rem)] flex items-center justify-between fixed left-[4.7rem] z-10 bottom-16 px-16"
					>
						{/* PREVIOUS STEP BUTTON */}
						<Link href={'/app/onboarding?step=about'}>
							<Button
								className="transition rounded-full shadow-lg hover:shadow-xl px-6"
								variant="secondary"
								type="button"
							>
								<ChevronLeft className="w-5 h-5 mr-1"/>
								Overview
							</Button>
						</Link>

						{/* NEXT STEP BUTTON */}
						<Button
							className="transition rounded-full shadow-lg px-6 hover:shadow-xl"
							variant="secondary"
							type="submit"
							disabled={form.formState.isSubmitting || !form.formState.isValid}
						>
							Looks good
							{form.formState.isSubmitting
								? <Loader2 className="w-4 h-4 ml-1 animate-spin"/>
								: <ChevronRight className="w-5 h-5 ml-1"/>
							}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default PersonalDetailsForm
