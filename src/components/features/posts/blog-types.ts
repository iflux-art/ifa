/**
 *  Frontmatter type ====================
/**
 *  Frontmatter type
 *  From Markdown/MDX file header metadata
 */
export interface BlogFrontmatter {
	/** Article title */
	title?: string;
	/** Article creation date */
	date?: string;
	/** Article description */
	description?: string;
	/** Article tags */
	tags?: string[];
	/** Article category */
	category?: string;
}

// ==================== Content type ====================
export interface ContentItem {
	/** Content unique identifier */
	id: string;
	/** Content title */
	title: string;
	/** Content description */
	description?: string;
	/** Content category */
	category?: string;
	/** Content tags */
	tags?: string[];
	/** Content creation date */
	date?: string;
	/** Content update date */
	update?: string;
	/** Content author */
	author?: string;
	/** Content cover image */
	cover?: string;
	/** Content status */
	status?: "draft" | "published" | "archived";
	/** Content access permission */
	access?: "public" | "private" | "protected";
	/** Content word count */
	wordCount?: number;
	/** Content reading time (minutes) */
	readingTime?: number;
}

// ==================== Blog post type ====================
export interface BlogPost extends ContentItem {
	/** Blog post excerpt */
	excerpt?: string;
	/** Blog post author avatar */
	authorAvatar?: string;
	/** Blog post author bio */
	authorBio?: string;
	/** Blog post published status */
	published?: boolean;
	/** Blog post slug */
	slug: string;
	/** Blog post image (alias for cover) */
	image?: string;
}
