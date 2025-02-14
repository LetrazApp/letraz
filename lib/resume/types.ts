import {EducationSchema} from '@/lib/education/types'
import {ExperienceSchema} from '@/lib/experience/types'
import {UserInfoSchema} from '@/lib/user-info/types'
import {z} from 'zod'
import {JobSchema} from '@/lib/job/types'

/*
 * Base schema for Resume and its sections
 * Check https://outline.letraz.app/api-reference/resume-object/get-resume-by-id for more information
 */

export const ResumeSectionSchema = z.object({
	id: z.string().describe('The unique identifier for the resume section.'),
	resume: z.string().describe('The identifier of the resume this section belongs to.'),
	index: z.number().describe('The position of this section within the resume.'),
	type: z.enum(['Education', 'Experience']).describe('The type of the resume section, either Education or Experience.'),
	data: z.union([EducationSchema, ExperienceSchema]).describe('The data associated with this section, either education or experience details.')
})

export const ResumeSchema = z.object({
	id: z.string().describe('The unique identifier for the resume.'),
	base: z.boolean().describe('Indicates if this is the base resume.'),
	user: UserInfoSchema.describe('The user information associated with the resume.'),
	job: JobSchema.describe('The job information associated with the resume.'),
	sections: z.array(ResumeSectionSchema).describe('The sections included in the resume, such as education and experience.')
})

// Infer TypeScript types from the schema
export type ResumeSection = z.infer<typeof ResumeSectionSchema>
export type Resume = z.infer<typeof ResumeSchema>
