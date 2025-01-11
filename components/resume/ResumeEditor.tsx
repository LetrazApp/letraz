'use client'

import {Resume} from '@/db/resumes.schema'
import {cn} from '@/lib/utils'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import EducationEditor from '@/components/resume/editors/EducationEditor'

const ResumeEditor = ({resume, className}: {resume: Resume, className?: string}) => {
	return (
		<div className={cn('p-6', className)}>
			<Tabs defaultValue="education" className="w-full">
				<TabsList className="grid w-full grid-cols-3 bg-neutral-100 p-1">
					<TabsTrigger
						value="education"
						className="data-[state=active]:bg-white"
					>
						Education
					</TabsTrigger>
					<TabsTrigger
						value="experience"
						className="data-[state=active]:bg-white"
					>
						Experience
					</TabsTrigger>
					<TabsTrigger
						value="skills"
						className="data-[state=active]:bg-white"
					>
						Skills
					</TabsTrigger>
				</TabsList>
				<TabsContent value="education">
					<EducationEditor className="mt-6" />
				</TabsContent>
				<TabsContent value="experience">
					<div className="text-center py-4 text-muted-foreground">
						Experience editor coming soon...
					</div>
				</TabsContent>
				<TabsContent value="skills">
					<div className="text-center py-4 text-muted-foreground">
						Skills editor coming soon...
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default ResumeEditor
