// Site-wide configuration (brand, SEO defaults).
export const siteConfig = {
	name: '任氏有无轩',
	description: '任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容',
	url: 'https://rsywx.net',
	author: '任氏有无轩',
	keywords: '图书馆,藏书,读书,博客,维客,资源,任氏有无轩',
	language: 'zh-CN',
	locale: 'zh_CN',
	/** External destinations used by the navigation. */
	links: {
		blog: 'https://blog.rsywx.net',
		wiki: 'https://rsywx.com'
	}
} as const;
