'use client'

import {motion} from 'motion/react'
import {z} from 'zod'
import {Link, useTransitionRouter} from 'next-view-transitions'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {cn} from '@/lib/utils'
import {Form, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {
	OnboardingFormInput,
	OnboardingFormSelect,
	OnboardingRichTextInput
} from '@/components/onboarding/OnboardingFormInput'
import {Button} from '@/components/ui/button'
import {ChevronLeft, ChevronRight, Loader2} from 'lucide-react'
import {months, years} from '@/constants'
import {toast} from 'sonner'
import {addEducationToDB, Education} from '@/lib/education.methods'
import {JSX} from 'react'

// Define the schema for the education form using zod
export const educationFormSchema = z.object({
	id: z.string().optional(),
	institution_name: z
		.string()
		.max(100, {message: 'That\'s a long name! We can\'t handle that'})
		.optional(),
	country: z.string().optional(),
	field_of_study: z.string().optional(),
	degree: z.string().optional(),
	started_from_month: z.string().optional(),
	started_from_year: z.string().optional(),
	finished_at_month: z.string().optional(),
	finished_at_year: z.string().optional(),
	current: z.boolean().optional(),
	description: z.string().optional()
})

// Define the props for the EducationForm component
type EducationFormProps = {
	className?: string
	educations: Education[]
	setEducations: (educations: Education[]) => void
}

/**
 * EducationForm component handles the form for adding educational details.
 *
 * @param {EducationFormProps} props - The properties object.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {Education[]} props.educations - The list of current education entries.
 * @param {function} props.setEducations - Function to update the list of education entries.
 * @returns {JSX.Element} The JSX code to render the education form.
 */
const EducationForm = ({
	className,
	educations,
	setEducations
}: EducationFormProps): JSX.Element => {
	const router = useTransitionRouter()

	// Initialize the form with default values and validation schema
	const form = useForm<z.infer<typeof educationFormSchema>>({
		resolver: zodResolver(educationFormSchema),
		defaultValues: {
			institution_name: '',
			country: '',
			field_of_study: '',
			degree: '',
			started_from_month: '',
			started_from_year: '',
			finished_at_month: '',
			finished_at_year: '',
			current: false,
			description: ''
		}
	})

	/**
	 * Function to insert education details into the database.
	 *
	 * @param {z.infer<typeof educationFormSchema>} values - The form values.
	 * @returns {Promise<Education>} The newly added education entry.
	 */
	const insertEducation = async (values: z.infer<typeof educationFormSchema>) => {
		return await addEducationToDB({
			...values,
			started_from_month: values.started_from_month ? months.findIndex((month) => month === values.started_from_month) + 1 : null,
			started_from_year: values.started_from_year ? parseInt(values.started_from_year) : null,
			finished_at_month: values.finished_at_month ? months.findIndex((month) => month === values.finished_at_month) + 1 : null,
			finished_at_year: values.finished_at_year ? parseInt(values.finished_at_year) : null,
			current: !values.finished_at_year
		})
	}

	/**
	 * Function to handle form submission.
	 * @param {z.infer<typeof educationFormSchema>} values - The form values.
	 */
	const onSubmit = async (values: z.infer<typeof educationFormSchema>) => {
		try {
			const newEducation = await insertEducation(values)
			if (newEducation) {
				setEducations([...educations, newEducation])
				form.reset()
			} else {
				throw new Error('Failed to add education')
			}
		} catch (error) {
			toast.error('Failed to add education, please try again')
		}
	}

	/**
	 * Function to handle form submission with redirect to next step.
	 * @param {z.infer<typeof educationFormSchema>} values - The form values.
	 */
	const submitWithRedirect = async (values: z.infer<typeof educationFormSchema>) => {
		try {
			if (form.formState.isDirty) {
				await insertEducation(values)
			}
			router.push('/app/onboarding?step=experience')
		} catch (error) {
			toast.error('Failed to update education, please try again')
		}
	}

	return (
		<div className={cn('max-w-2xl flex flex-col', className)}>
			{/* Informational message about the benefits of adding educational details */}
			<motion.div
				className="text-xl mt-8 max-w-xl"
				initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2, duration: 0.7}}
			>
				<p>
					Having 2 or more educational details can increase the chance of your
					résumé getting selected upto 15%
				</p>
			</motion.div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="mt-12">
					{/* Form fields for institution name and country */}
					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
						transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between w-full"
					>
						<FormField
							control={form.control}
							name="institution_name"
							render={({field}) => (
								<FormItem className="w-[95%]">
									<OnboardingFormInput
										placeholder="institution"
										{...field}
										autoFocus
									/>
									<FormLabel className="transition">
										Name of the institution
									</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="country"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="country" {...field} />
									<FormLabel className="transition">Country</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>

					{/* Form fields for field of study and degree */}
					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
						transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between my-8"
					>
						<FormField
							control={form.control}
							name="field_of_study"
							render={({field}) => (
								<FormItem className="w-[95%]">
									<OnboardingFormInput placeholder="field" {...field} />
									<FormLabel className="transition">Field of study</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="degree"
							render={({field}) => (
								<FormItem>
									<OnboardingFormInput placeholder="degree" {...field} />
									<FormLabel className="transition">Degree earned</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>

					{/* Form fields for start and end dates */}
					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
						transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between my-6"
					>
						{/* Form field for start month */}
						<FormField
							control={form.control}
							name="started_from_month"
							render={({field}) => (
								<FormItem className="w-full">
									<OnboardingFormSelect
										onChange={field.onChange}
										value={field.value}
										options={months}
										placeholder="Start month"
									/>
									<FormLabel className="transition">
										Month of starting
									</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Form field for start year */}
						<FormField
							control={form.control}
							name="started_from_year"
							render={({field}) => (
								<FormItem className="w-full">
									<OnboardingFormSelect
										onChange={field.onChange}
										value={field.value}
										options={years}
										placeholder="Start year"
									/>
									<FormLabel className="transition">Year of starting</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Form field for end month */}
						<FormField
							control={form.control}
							name="finished_at_month"
							render={({field}) => (
								<FormItem className="w-full">
									<OnboardingFormSelect
										onChange={field.onChange}
										value={field.value}
										options={months}
										placeholder="End month"
									/>
									<FormLabel className="transition">Month of end</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Form field for end year */}
						<FormField
							control={form.control}
							name="finished_at_year"
							render={({field}) => (
								<FormItem className="w-full">
									<OnboardingFormSelect
										onChange={field.onChange}
										value={field.value}
										options={years}
										placeholder="End year"
									/>
									<FormLabel className="transition">Year of end</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>

					{/* Form field for description */}
					<motion.div
						initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
						transition={{delay: 0.4, duration: 0.7}}
						className="flex items-center gap-8 justify-between"
					>
						<FormField
							control={form.control}
							name="description"
							render={({field}) => (
								<FormItem className="w-full">
									<FormLabel className="transition">
										Description (optional)
									</FormLabel>
									<OnboardingRichTextInput placeholder="write a few things about what you learnt, the things you've build etc."
										value={field?.value}
										onChange={field?.onChange}
									/>
									<FormLabel className="transition">Description (optional)</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>

					{/* Navigation buttons */}
					<div
						className="w-[calc(100%-4.7rem)] flex items-center justify-between fixed left-[4.7rem] z-10 bottom-16 px-16"
					>
						{/* Button to navigate to the previous step */}
						<Link href={'/app/onboarding?step=personal-details'}>
							<Button
								className="transition rounded-full shadow-lg hover:shadow-xl px-6"
								variant="secondary"
								type="button"
							>
								<ChevronLeft className="w-5 h-5 mr-1" />
								Personal details
							</Button>
						</Link>

						{/* Buttons to add another education or proceed to the next step */}
						<div className=" flex items-center gap-4">
							<Button
								className="transition rounded-full shadow-lg px-6 hover:shadow-xl"
								variant="secondary"
								type="submit"
								disabled={form.formState.isSubmitting || !form.formState.isDirty}
							>
								Add another
								{form.formState.isSubmitting
									? <Loader2 className="w-4 h-4 ml-1 animate-spin"/>
									: <ChevronRight className="w-5 h-5 ml-1"/>
								}
							</Button>

							<Button
								className="transition rounded-full shadow-lg px-6 hover:shadow-xl"
								variant="secondary"
								type="button"
								onClick={form.handleSubmit(submitWithRedirect)}
								disabled={form.formState.isSubmitting}
							>
								What's next
								{form.formState.isSubmitting
									? <Loader2 className="w-4 h-4 ml-1 animate-spin" />
									: <ChevronRight className="w-5 h-5 ml-1" />
								}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default EducationForm
