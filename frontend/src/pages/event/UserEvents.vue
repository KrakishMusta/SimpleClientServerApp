<script setup lang="ts">
const events = [
	{
		id: 1,
		name: "Product Launch Night",
		date: "Mar 14, 2026",
		time: "19:00",
		location: "Pier 27, SF",
		status: "Upcoming",
		tags: ["Launch", "Networking"],
		cover: "radial-gradient(90% 120% at 10% 0%, #ffe7b7 0%, #ffc07a 35%, #ff7d5f 100%)",
	},
	{
		id: 2,
		name: "Design Systems Meetup",
		date: "Mar 28, 2026",
		time: "18:30",
		location: "Studio 5A",
		status: "Upcoming",
		tags: ["UX", "Talks"],
		cover: "radial-gradient(80% 140% at 100% 0%, #d7f1ff 0%, #9fd1ff 45%, #4f7cff 100%)",
	},
	{
		id: 3,
		name: "Community Run",
		date: "Feb 22, 2026",
		time: "08:00",
		location: "Bay Trail",
		status: "Completed",
		tags: ["Outdoors"],
		cover: "radial-gradient(90% 120% at 10% 10%, #d9ffd8 0%, #9fe6a7 45%, #5dbb7a 100%)",
	},
];

const stats = [
	{ label: "Total", value: "12" },
	{ label: "Upcoming", value: "5" },
	{ label: "This Month", value: "3" },
];

const filters = ["All", "Upcoming", "Completed", "Drafts"];
</script>

<template>
	<section class="page">
		<header class="hero">
			<div class="hero-copy">
				<p class="eyebrow">Your Events</p>
				<h1>Plan fast. Show up ready.</h1>
				<p class="sub">
					A clean command center for everything you are hosting or attending.
				</p>
				<div class="actions">
					<button class="btn primary">Create Event</button>
					<button class="btn ghost">Import Calendar</button>
				</div>
			</div>
			<div class="hero-stats">
				<div v-for="item in stats" :key="item.label" class="stat">
					<span class="stat-value">{{ item.value }}</span>
					<span class="stat-label">{{ item.label }}</span>
				</div>
			</div>
		</header>

		<div class="toolbar">
			<div class="filters">
				<button v-for="filter in filters" :key="filter" class="chip">
					{{ filter }}
				</button>
			</div>
			<div class="tools">
				<input class="search" placeholder="Search events" />
				<button class="btn slim">Sort: Date</button>
			</div>
		</div>

		<div class="grid">
			<article v-for="event in events" :key="event.id" class="card">
				<div class="cover" :style="{ background: event.cover }">
					<span class="pill">{{ event.status }}</span>
				</div>
				<div class="card-body">
					<div class="meta">
						<span>{{ event.date }}</span>
						<span>•</span>
						<span>{{ event.time }}</span>
					</div>
					<h3>{{ event.name }}</h3>
					<p class="location">{{ event.location }}</p>
					<div class="tags">
						<span v-for="tag in event.tags" :key="tag" class="tag">{{ tag }}</span>
					</div>
					<div class="card-actions">
						<button class="btn ghost">View</button>
						<button class="btn primary">Manage</button>
					</div>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped lang="css">
:root {
	color-scheme: light;
}

.page {
	--bg: #0f1419;
	--surface: #161c22;
	--surface-2: #1d242b;
	--text: #f3f5f7;
	--muted: #a5b1bd;
	--accent: #ff9f66;
	--accent-2: #7ad7ff;
	min-height: 100vh;
	padding: 32px clamp(20px, 5vw, 60px) 60px;
	font-family: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
	background:
		radial-gradient(1000px 800px at 0% -10%, #263449 0%, transparent 60%),
		radial-gradient(800px 700px at 90% -20%, #2d2437 0%, transparent 55%),
		var(--bg);
	color: var(--text);
}

.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
	gap: 28px;
	padding: 28px;
	border-radius: 24px;
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
	margin-bottom: 28px;
	animation: rise 0.7s ease-out both;
}

.hero-copy h1 {
	font-size: clamp(2rem, 3vw, 3.2rem);
	letter-spacing: -0.02em;
	margin: 8px 0 12px;
}

.eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.2em;
	font-size: 0.7rem;
	color: var(--accent-2);
	margin: 0;
}

.sub {
	max-width: 520px;
	color: var(--muted);
	margin: 0 0 20px;
}

.actions {
	display: flex;
	gap: 12px;
}

.hero-stats {
	display: grid;
	gap: 16px;
	align-content: center;
}

.stat {
	padding: 16px 18px;
	border-radius: 16px;
	background: var(--surface);
	border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-value {
	display: block;
	font-size: 1.6rem;
	font-weight: 600;
}

.stat-label {
	color: var(--muted);
	font-size: 0.85rem;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 24px;
}

.filters {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.chip {
	background: var(--surface-2);
	color: var(--text);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 999px;
	padding: 8px 14px;
	font-size: 0.85rem;
	cursor: pointer;
	transition: transform 0.2s ease, background 0.2s ease;
}

.chip:hover {
	transform: translateY(-2px);
	background: rgba(255, 255, 255, 0.12);
}

.tools {
	display: flex;
	gap: 10px;
	align-items: center;
}

.search {
	background: var(--surface);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 12px;
	padding: 10px 14px;
	color: var(--text);
	min-width: 200px;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}

.card {
	background: var(--surface);
	border-radius: 20px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.08);
	display: flex;
	flex-direction: column;
	min-height: 340px;
	transition: transform 0.25s ease, box-shadow 0.25s ease;
	animation: fade 0.6s ease both;
}

.card:hover {
	transform: translateY(-6px);
	box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
}

.cover {
	padding: 18px;
	min-height: 120px;
	display: flex;
	justify-content: flex-end;
}

.pill {
	background: rgba(0, 0, 0, 0.45);
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: #fff;
	border-radius: 999px;
	padding: 6px 12px;
	font-size: 0.75rem;
}

.card-body {
	padding: 18px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.meta {
	color: var(--muted);
	font-size: 0.85rem;
	display: flex;
	gap: 6px;
	align-items: center;
}

.card-body h3 {
	margin: 0;
	font-size: 1.1rem;
}

.location {
	margin: 0;
	color: var(--muted);
}

.tags {
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
}

.tag {
	background: rgba(255, 255, 255, 0.08);
	border-radius: 8px;
	padding: 4px 8px;
	font-size: 0.75rem;
}

.card-actions {
	margin-top: auto;
	display: flex;
	gap: 10px;
}

.btn {
	border-radius: 12px;
	border: 1px solid transparent;
	padding: 10px 16px;
	font-size: 0.85rem;
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn.primary {
	background: linear-gradient(135deg, #ffb06b 0%, #ff7f5c 100%);
	color: #1a0e05;
	font-weight: 600;
}

.btn.ghost {
	background: transparent;
	color: var(--text);
	border-color: rgba(255, 255, 255, 0.2);
}

.btn.slim {
	background: var(--surface-2);
	color: var(--text);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 10px 14px;
}

.btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
}

@keyframes fade {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes rise {
	from {
		opacity: 0;
		transform: translateY(14px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (max-width: 900px) {
	.hero {
		grid-template-columns: 1fr;
	}

	.tools {
		width: 100%;
		justify-content: space-between;
	}

	.search {
		flex: 1;
	}
}

@media (max-width: 600px) {
	.page {
		padding: 24px 16px 40px;
	}

	.actions {
		flex-direction: column;
		align-items: stretch;
	}

	.card-actions {
		flex-direction: column;
	}
}
</style>
