# GitFetch

A GitHub profile explorer built with vanilla JavaScript, HTML, and CSS. Search any GitHub username to instantly view their profile stats, bio, and recently updated repositories, powered directly by the GitHub REST API, no backend required.

## Project Demonstration

> Replace this with your actual video link or embed.

**Demonstration video:**

```md
https://youtu.be/dqg4fJ41xyQ
```

## Features

- Instant GitHub user lookup by username
- Profile sidebar — avatar, name, bio, location, follower/following counts, repo count
- Recently updated repositories grid with star/fork counts and a language indicator
- Loading state with live status messages
- Error handling for invalid usernames, rate limits, and network failures
- Responsive layout for mobile and tablet

## Tech Stack

- HTML5
- CSS3 (custom properties, CSS Grid, `backdrop-filter` glass effect)
- Vanilla JavaScript (Fetch API, async/await)
- [GitHub REST API](https://docs.github.com/en/rest) — no auth required (60 req/hr limit)

## Project Structure

```
gitfetch/
├── github.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

1. Clone the repo
2. Open `github.html` in your browser — no build step or dependencies needed

## API Reference

| Endpoint                                               | Purpose                                 |
| ------------------------------------------------------ | --------------------------------------- |
| `GET /users/{username}`                                | Profile data — name, bio, avatar, stats |
| `GET /users/{username}/repos?sort=updated&per_page=12` | Recently updated repositories           |

## License

MIT
