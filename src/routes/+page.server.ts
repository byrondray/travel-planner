import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const actions: Actions = {
	generatePlan: async ({ request }) => {
		try {
			const formData = await request.formData();

			const destination = formData.get('destination') as string;
			const duration = parseInt(formData.get('duration') as string);
			const budget = formData.get('budget') as string;
			const interests = formData.get('interests') as string;
			const travelStyle = formData.get('travelStyle') as string;

			if (!destination || !duration || !budget || !travelStyle) {
				return fail(400, { error: 'Missing required fields' });
			}

			try {
				const prompt = `
          Create a detailed ${duration}-day travel itinerary for ${destination}. 
          Budget level: ${budget}. 
          Travel style: ${travelStyle}.
          Interests: ${interests || 'general sightseeing'}.
          
          Include:
          - Day-by-day breakdown with morning, afternoon, and evening activities
          - Recommended places to eat
          - Notable attractions to visit
          - Practical tips specific to this destination
          
          Format the response as HTML with proper headings, lists, and paragraphs. Do not include markdown code block markers like \`\`\`html or \`\`\`.
        `;

				const response = await openai.chat.completions.create({
					model: 'gpt-4-turbo',
					messages: [
						{
							role: 'system',
							content:
								'You are a travel planning expert who creates detailed, personalized travel itineraries. Return your response as clean HTML without markdown code block syntax.'
						},
						{
							role: 'user',
							content: prompt
						}
					],
					temperature: 0.7
				});

				let planHtml = response.choices[0].message.content || '';

				planHtml = planHtml
					.replace(/```html\n?|```\n?/g, '')
					.replace(/This HTML document provides.*$/s, '')
					.replace(/^.*This is a.*\n/m, '');

				return {
					planHtml,
					destination,
					duration,
					budget,
					interests,
					travelStyle,
					date: new Date().toISOString().slice(0, 10)
				};
			} catch (openAiError) {
				console.error('OpenAI API error:', openAiError);
				return fail(500, { error: 'Error communicating with AI service. Please try again.' });
			}
		} catch (error) {
			console.error('Error generating travel plan:', error);
			return fail(500, { error: 'Failed to generate travel plan. Please try again.' });
		}
	}
};
