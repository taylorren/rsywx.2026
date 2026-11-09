// Site-wide configuration (brand, SEO defaults, masthead content).
export const siteConfig = {
	name: '任氏有无轩',
	description: '任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容',
	url: 'https://rsywx.net',
	author: '任氏有无轩',
	keywords: '图书馆,藏书,读书,博客,维客,资源,任氏有无轩',
	language: 'zh-CN',
	locale: 'zh_CN',

	/** The masthead counts "years in print" from this year. */
	founded: 1989,

	/** Epigraph set under the wordmark — the studio's own namesake line. */
	motto: '有之以为利，无之以为用。',
	mottoSource: '《道德经》第十一章',

	/**
	 * The front-page plate: a portrait plus the quotation it carries. One is
	 * chosen per issue (day of year) on the server, so it never needs JS.
	 */
	frontPage: [
		{
			src: '/images/hannibal.webp',
			caption: '汉尼拔·莱克特博士',
			quote: 'First principles, Clarice. Simplicity.',
			source: 'Dr. Hannibal Lecter'
		},
		{
			src: '/images/hilbert.webp',
			caption: '大卫·希尔伯特',
			quote: 'Wir müssen wissen. Wir werden wissen.',
			source: 'David Hilbert'
		},
		{
			src: '/images/keynes.webp',
			caption: '约翰·梅纳德·凯恩斯',
			quote: '…the sound principle is to take the most generous course.',
			source: 'John Maynard Keynes'
		}
	],

	/** In-app navigation, rendered in the folio bar. */
	nav: [
		{ href: '/', label: '首页' },
		{ href: '/books/list', label: '藏书' },
		{ href: '/books/visits', label: '阅览' },
		{ href: '/readings', label: '读书' }
	],

	/** Destinations outside this app, shown with an external-link mark. */
	external: [
		{ href: 'https://blog.rsywx.net', label: '博客' },
		{ href: 'https://rsywx.com', label: '维客' }
	],

	/** The few ways to reach the keeper of the house, printed on /contact. */
	social: [
		{
			label: '邮箱',
			handle: 'taylor.ren@gmail.com',
			href: 'mailto:taylor.ren@gmail.com',
			external: false
		},
		{ label: 'X', handle: '@taylorren', href: 'https://x.com/taylorren', external: true },
		{
			label: 'Facebook',
			handle: 'taylor.ren',
			href: 'https://facebook.com/taylor.ren',
			external: true
		},
		{ label: 'GitHub', handle: 'taylorren', href: 'https://github.com/taylorren', external: true }
	],

	/** External destinations used by the navigation. */
	links: {
		blog: 'https://blog.rsywx.net',
		wiki: 'https://rsywx.com',
		contact: '/contact'
	}
} as const;

/** One front-page plate, as configured above. */
export type FrontPlate = (typeof siteConfig.frontPage)[number];
