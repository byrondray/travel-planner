import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }: { request: Request }) {
	try {
		const { destination, duration, budget, interests, travelStyle } = await request.json();

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

		planHtml = planHtml.replace(/```html\n?|```\n?/g, '');

		return json({
			destination,
			duration,
			budget,
			interests,
			travelStyle,
			planHtml
		});
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate travel plan' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
