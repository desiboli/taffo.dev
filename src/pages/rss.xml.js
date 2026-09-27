import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	return rss({
		title: `${SITE_TITLE} — Writing`,
		description: SITE_DESCRIPTION,
		site: context.site,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
		},
		customData: `<language>en-us</language><atom:link href="${new URL('rss.xml', context.site)}" rel="self" type="application/rss+xml" />`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
		})),
	});
}
