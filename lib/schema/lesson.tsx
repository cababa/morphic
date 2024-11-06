// /lib/schema/lesson.tsx

import { DeepPartial } from 'ai';
import { z } from 'zod';

export const lessonSchema = z.object({
  warm_up: z.string().describe('Introduction of the lesson'),
  class: z.object({
    content: z.string().describe('Development content of the class'),
    media: z.array(
      z.object({
        type: z.enum(['image', 'video']).describe('Type of media'),
        url: z.string().url().describe('URL of the media'),
        description: z.string().optional().describe('Description of the media')
      })
    ).optional().describe('Media to be displayed alongside the class content'),
  }).describe('Development content with optional media'),
  class_activity: z.object({
    activity: z.string().describe('Description of the class activity or video'),
    questions: z.array(z.string()).describe('Questions for discussion')
  }).describe('Class activity with discussion questions'),
  class_conclusion: z.string().describe('Conclusion of the lesson')
});

export type PartialLesson = DeepPartial<typeof lessonSchema>;

export type Lesson = z.infer<typeof lessonSchema>;