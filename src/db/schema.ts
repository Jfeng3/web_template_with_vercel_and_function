import { pgTable, text, timestamp, integer, numeric, uuid, boolean, jsonb, bigint } from 'drizzle-orm/pg-core';

export const replies = pgTable('replies', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  originalText: text('original_text'),
  imageUrl: text('image_url'),
  reply: text('reply'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  status: text('status').default('wait for review'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  text: text('text'),
  authorName: text('author_name'),
  authorUsername: text('author_username'),
  likesCount: integer('likes_count').default(0),
  retweetsCount: integer('retweets_count').default(0),
  repliesCount: integer('replies_count').default(0),
  url: text('url'),
  relevanceScore: numeric('relevance_score').default('0.0'),
});

export const personas = pgTable('personas', {
  id: uuid('id').primaryKey().defaultRandom(),
  xAccountName: text('x_account_name'),
  personaName: text('persona_name'),
  personaDesc: text('persona_desc'),
  brandVoice: text('brand_voice'),
  brandStyle: text('brand_style'),
  logo: text('logo'),
  colorPalette: jsonb('color_palette'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tweetSelectionCriteria = pgTable('tweet_selection_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  includeKeywords: text('include_keywords').array().default([]),
  excludeKeywords: text('exclude_keywords').array().default([]),
  hashtags: text('hashtags').array().default([]),
  minLikes: integer('min_likes').default(5),
  minRetweets: integer('min_retweets').default(1),
  minReplies: integer('min_replies').default(0),
  maxAgeHours: integer('max_age_hours').default(24),
  checkFrequencyMinutes: integer('check_frequency_minutes').default(60),
  language: text('language').default('en'),
  verifiedOnly: boolean('verified_only').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const discoveredTweets = pgTable('discovered_tweets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tweetId: text('tweet_id').notNull().unique(),
  userId: text('user_id').notNull(),
  authorId: text('author_id').notNull(),
  authorUsername: text('author_username').notNull(),
  authorName: text('author_name').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  likesCount: integer('likes_count').default(0),
  retweetsCount: integer('retweets_count').default(0),
  repliesCount: integer('replies_count').default(0),
  relevanceScore: integer('relevance_score').default(0),
  status: text('status').default('discovered'),
  discoveredAt: timestamp('discovered_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const xToken = pgTable('x_token', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  xAccountName: text('x_account_name').notNull().unique(),
  accessToken: text('access_token').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const memo = pgTable('memo', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().default('jfeng1115@gmail.com'),
  textMemo: text('text_memo'),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  tagKey: text('tag_key').notNull(),
  memoId: uuid('memo_id').notNull().references(() => memo.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  email: text('email').default('jfeng1115@gmail.com'),
});

// Daily Notes Writer Tables
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  tag: text('tag').notNull(),
  status: text('status').notNull().default('draft'), // 'draft' | 'ready'
  originalContent: text('original_content'), // For storing content before AI styling
  wordCount: integer('word_count').notNull(),
  userId: text('user_id'), // For future multi-user support
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const weeklyTags = pgTable('weekly_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  tag1: text('tag1').notNull(),
  tag2: text('tag2').notNull(),
  weekStart: timestamp('week_start', { withTimezone: true }).notNull(),
  weekEnd: timestamp('week_end', { withTimezone: true }).notNull(),
  userId: text('user_id'), // For future multi-user support
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});