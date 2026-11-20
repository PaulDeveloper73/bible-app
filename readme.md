# Selah — Bible, Prayer & Devotion

**Make room for the Word. Grow in grace, one day at a time.**

Selah is a responsive Bible-reading, Scripture-discovery, devotion and personal reflection web application. It brings Bible reading, daily encouragement, prayer notes, a personal journal, saved verses and guided reading plans into one calm, mobile-friendly experience.

**[▶ VIEW LIVE PROJECT PREVIEW](https://pauldeveloper73.github.io/bible-app/)**

**[Developer Portfolio](https://pauldeveloper73.github.io/Kisakye-Paul-Elite-Portifolio/)**

---

## Project Overview

Selah is designed for people who want a simple, consistent place to read Scripture, reflect on what they have read and keep personal faith notes. The interface is built around a warm brown, cream and paper-inspired visual identity, with layouts designed for mobile phones, tablets and desktop screens.

The project connects to **API.Bible** for Bible resources.

Its configured Bible ID is:

```text
a6aee10bb058511c-02
```

The current interface identifies this resource as the **King James Version (KJV)**. Actual translation availability and usage permissions are controlled by the API.Bible account and the relevant translation terms.

### Live Preview

**https://pauldeveloper73.github.io/bible-app/**

The public preview is hosted on GitHub Pages. GitHub Pages serves static frontend files; the Node.js API proxy in this repository must be deployed separately for secure, live API.Bible requests.

See the Deployment section before publishing a production version.

---

## Key Features

### 1. Bible Reading

- Retrieve the Bible translations available to the configured API.Bible account.
- Browse books and chapters for the selected Bible resource.
- Load chapter content from API.Bible.
- Move between chapters and display verse-level actions.
- Adjust the reader text size.

### 2. Scripture Discovery

- Search Scripture using keywords or references such as `Psalm 91` and `John 3:16`.
- Explore suggested themes including faith, protection, healing, wisdom and peace.
- Open a search result in the Bible reader.
- Save a verse or use it as the starting point for a prayer reflection.

### 3. Daily Engagement

- Display a rotating Scripture-of-the-day selection.
- Present a built-in daily devotional reflection.
- Provide reading plans focused on protection and wisdom.
- Track reading activity and plan progress in the current browser.
- Offer optional browser reminders while the application is open and active.

### 4. Prayer and Personal Reflection

- Record prayer requests, thanksgiving and Scripture-based reflections.
- Categorize prayer entries by focus.
- Keep a personal journal of lessons, thoughts and gratitude.
- Save, revisit, share and remove selected Bible verses.

### 5. Responsive Interface

- Mobile-first layouts with responsive navigation.
- Tablet and desktop layouts with expanded navigation and content areas.
- Readable Scripture typography and clear content hierarchy.
- Accessible form labels, semantic page sections and visible keyboard focus styles.
- Brown, deep-brown, cream and paper color palette.

**Current implementation note:** The devotional reflections and reading-plan definitions are bundled into the frontend. Reading history, saved verses, prayer entries, journal entries, plan progress and preferences are stored in the visitor's browser using `localStorage`. They are not currently synchronized to a user account or cloud database.

---

## Technology Stack

| Area                      | Technology                               |
| ------------------------- | ---------------------------------------- |
| User interface            | HTML5                                    |
| Styling                   | Tailwind CSS v3 via CDN, with custom CSS |
| Typography                | Plus Jakarta Sans and Cormorant Garamond |
| Frontend behavior         | Vanilla JavaScript (ES6+)                |
| Bible content             | API.Bible REST API                       |
| API middleware            | Node.js 20+ and Express                  |
| API security middleware   | Helmet and express-rate-limit            |
| Environment configuration | dotenv                                   |
| Browser persistence       | localStorage                             |
| Demo hosting              | GitHub Pages                             |

The project does not require React, a frontend bundler or a database for its current demonstration version.

---

## Project Structure

Use the following structure when running the project locally:

```text
selah-bible-app/
│
├── bible-app-ui.html       # Main responsive application interface
├── bible-app.js            # Browser-side application logic
├── bible-api-proxy.js      # Node.js proxy for secure API.Bible requests
├── .env                    # Private server configuration (never commit)
├── .env.example            # Safe environment-variable template
├── .gitignore              # Excludes secrets and dependencies
├── package.json            # Node.js dependencies and scripts
└── README.md               # Project documentation
```

The HTML file and JavaScript file must be in the same directory unless you update the script path in the HTML.

---

## Getting Started

### 1. Prerequisites

Install or prepare:

- [Node.js 20 or later](https://nodejs.org/)
- npm (included with Node.js).
- Visual Studio Code or another code editor.
- A modern browser.
- An API.Bible account and API key for live Scripture requests.

### 2. Add the Frontend Script

Open `bible-app-ui.html`.

Immediately before the closing `</body>` tag, add:

```html
<script src="./bible-app.js" defer></script>
```

Add this script tag only once. Without it, the HTML will display the interface but the separate JavaScript application controller will not run.

### 3. Install Backend Dependencies

Open a terminal in the project folder and run:

```bash
npm init -y
npm install express helmet express-rate-limit dotenv
```

The supplied proxy uses the built-in `fetch()` API available in modern Node.js versions, so no additional HTTP client package is needed.

### 4. Configure the API Key

Create a file named `.env` in the project root:

```env
BIBLE_API_KEY=YOUR_API_BIBLE_KEY_HERE
PORT=3000
FRONTEND_ORIGIN=http://127.0.0.1:5500
```

Replace `YOUR_API_BIBLE_KEY_HERE` with the API key from your API.Bible account.

`FRONTEND_ORIGIN` must match the exact origin shown in your browser address bar.

For example, `http://localhost:5500` and `http://127.0.0.1:5500` are different origins. Use the one your local development server actually opens.

Create a safe `.env.example` template for the repository if you want to document the required variables without sharing the key:

```env
BIBLE_API_KEY=replace_with_your_api_key
PORT=3000
FRONTEND_ORIGIN=http://127.0.0.1:5500
```

### 5. Protect Private Files

Create or update `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example
npm-debug.log*
.DS_Store
```

**Never commit your real API key.**

If a key has already been pushed to a public repository, revoke or rotate it in the API.Bible dashboard and replace it in the server environment.

### 6. Configure the Frontend API Address

Open `bible-app.js` and find the `CONFIG` object near the top.

For a frontend served by VS Code Live Server on a separate local port, change:

```javascript
apiBaseUrl: '/api/bible/v1',
```

to:

```javascript
apiBaseUrl: 'http://localhost:3000/api/bible/v1',
```

Use the same hostname consistently. If your browser opens the frontend on `127.0.0.1`, the proxy CORS origin must use that exact host.

For a same-origin deployment where the frontend and proxy are served by the same domain, keep the default relative address:

```javascript
apiBaseUrl: '/api/bible/v1',
```

### 7. Start the API Proxy

In the project terminal, run:

```bash
node bible-api-proxy.js
```

The proxy should report that it is listening on port `3000`.

Open the health-check endpoint:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

You can also test whether the proxy can reach API.Bible by opening:

```text
http://localhost:3000/api/bible/v1/bibles
```

A successful response should contain a `data` array of Bible resources available to your API key.

### 8. Run the Frontend

Open `bible-app-ui.html` with VS Code Live Server or another local static web server.

Do not rely on opening the file directly with a `file://` URL for API testing; use an HTTP development server instead.

The frontend and backend should both be running:

- Frontend: for example, `http://127.0.0.1:5500`
- API proxy: `http://localhost:3000`

---

## API.Bible Integration

Selah uses API.Bible's REST API through the local Node.js proxy. The proxy adds the private `api-key` header on the server and forwards the API response to the browser.

### Configured Bible Resource

| Setting             | Value                        |
| ------------------- | ---------------------------- |
| Provider            | API.Bible                    |
| API base URL        | `https://rest.api.bible/v1`  |
| Configured Bible ID | `a6aee10bb058511c-02`        |
| Local proxy prefix  | `/api/bible/v1`              |
| Authentication      | Server-side `api-key` header |

### API Resources Used by the Frontend

| Purpose                | Request pattern                                   |
| ---------------------- | ------------------------------------------------- |
| List accessible Bibles | `GET /bibles`                                     |
| List books             | `GET /bibles/{bibleId}/books`                     |
| List chapters          | `GET /bibles/{bibleId}/books/{bookId}/chapters`   |
| Retrieve a chapter     | `GET /bibles/{bibleId}/chapters/{chapterId}`      |
| Retrieve a verse       | `GET /bibles/{bibleId}/verses/{verseId}`          |
| Search Scripture       | `GET /bibles/{bibleId}/search?query={searchTerm}` |

Consult the [official API.Bible documentation](https://docs.api.bible/) for endpoint details, account limits, available Bible resources and current usage rules.

### FUMS and Scripture Attribution

API.Bible requires its Fair Use Management System (FUMS) for web applications.

The frontend includes the FUMS v3 tracker loader and a `trackView` reporting hook. Before a production release, verify that every Scripture-content request includes `fums-version=3`, that the API response's `meta.fumsToken` is preserved by the proxy, and that each displayed Scripture response is reported using its token.

Read the [official FUMS v3 implementation guide](https://docs.api.bible/guides/fair-use/).

Display the relevant translation copyright and attribution information in accordance with the terms that apply to the Bible resource you use. Access to a Bible ID does not automatically grant unrestricted redistribution or commercial use of every translation.

---

## Deployment

### Frontend Deployment on GitHub Pages

The current public preview is:

**https://pauldeveloper73.github.io/bible-app/**

GitHub Pages is static hosting. It can serve the HTML, CSS and browser JavaScript, but it does not run the Node.js/Express proxy.

Therefore, a production deployment that uses the secure API proxy needs two parts:

1. **Frontend:** Publish `bible-app-ui.html`, `bible-app.js` and the required static assets through GitHub Pages.
2. **Backend:** Deploy `bible-api-proxy.js` to a Node.js hosting environment that supports environment variables and HTTPS.

See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages) for the static hosting model.

### Connect GitHub Pages to a Deployed Backend

After deploying the proxy, suppose your backend address is:

```text
https://your-selah-api.example.com
```

Update the frontend configuration in `bible-app.js`:

```javascript
apiBaseUrl: 'https://your-selah-api.example.com/api/bible/v1',
```

Set the backend environment variables in your hosting provider's private environment configuration:

```env
BIBLE_API_KEY=YOUR_REAL_API_BIBLE_KEY
PORT=3000
FRONTEND_ORIGIN=https://pauldeveloper73.github.io
```

Use the exact frontend origin only in `FRONTEND_ORIGIN`—do not append `/bible-app/` or a trailing path.

The supplied proxy currently allows one configured frontend origin. If you need multiple domains, staging environments or preview deployments, extend the CORS configuration with a controlled origin allowlist rather than allowing every origin.

Use HTTPS for the public frontend and backend.

Do not place the API key in `bible-app.js`, HTML, public GitHub repository secrets, or a browser-visible configuration file.

### Production Deployment Checklist

- [ ] Deploy the Node.js proxy to a server that supports Node.js 20+.
- [ ] Store `BIBLE_API_KEY` as a private server environment variable.
- [ ] Set `FRONTEND_ORIGIN` to the exact public frontend origin.
- [ ] Change `apiBaseUrl` to the deployed proxy URL.
- [ ] Confirm `/health` responds successfully.
- [ ] Confirm the proxy can retrieve the available Bible resources.
- [ ] Confirm the selected Bible ID is available to the API key.
- [ ] Verify FUMS v3 parameters, tokens and view reporting.
- [ ] Confirm required copyright notices and translation permissions.
- [ ] Test search, book selection, chapter loading and verse actions on mobile and desktop.
- [ ] Confirm that no API key or `.env` file is exposed in the repository or browser.
- [ ] Add monitoring, server logs, backups and an operational error-reporting process.

---

## Current Data Storage and Privacy

The current demonstration version uses browser `localStorage` for:

- Saved verses.
- Prayer entries and prayer categories.
- Personal journal entries.
- Reading-day activity and reading-plan progress.
- Display preferences and reminder settings.

This means the saved information belongs to the current browser profile on the current device.

It is not automatically backed up, encrypted by the application, associated with a verified user account or synchronized to another device.

Clearing browser storage, using a different browser or switching devices may make those records unavailable.

### Not Yet Included

The current application does not include:

- User registration, login, password recovery or account management.
- A PostgreSQL or other server-side application database.
- Cross-device synchronization.
- Server-side journal backups or data restoration.
- Role-based access control or administrator tools.
- Reliable push notifications when the browser is closed.
- Payment processing, subscriptions or a billing portal.

The Node.js proxy is an API key protection layer for API.Bible requests. It is not a complete user-account backend or a cloud-storage service for personal records.

**Privacy Notice:** This project is intended for demonstration and small-scale browser-based personal record keeping in its current form.

Before using it to store sensitive prayer journals, confidential personal information or records requiring long-term retention, add appropriate authentication, access controls, secure server-side storage, encryption where appropriate, reliable backups, retention controls and a clear privacy policy.

---

## Roadmap and Opportunities for Expansion

The existing application provides a foundation that can be expanded into a more complete Bible and faith-engagement platform.

### Planned Enhancements

- Secure user registration, login and account recovery.
- PostgreSQL database and authenticated API endpoints.
- Cloud synchronization for bookmarks, prayer entries, journals and reading progress.
- User-controlled backup, export and account deletion tools.
- More reading plans, devotionals and customizable daily schedules.
- Improved Scripture search filters and topical collections.
- Progressive Web App installation and offline reading for content that may legally be cached.
- Service-worker and server-side push notifications.
- Accessibility testing, automated tests, analytics and production monitoring.
- Optional church, ministry or group features with appropriate permissions.

These items are proposed enhancements, not claims that the current version already provides them.

---

## Troubleshooting

### `Failed to parse URL`

Check that `apiBaseUrl` is a valid URL or a valid same-origin path.

An API key is not a URL; the key belongs in the server-side `api-key` request header.

### `401 Unauthorized`

Check that `BIBLE_API_KEY` is correct, active and loaded by the Node.js process.

Restart the proxy after changing `.env`.

### `403 Forbidden`

The requested Bible or endpoint may not be available to the API key, or the selected resource may require additional permissions.

Check the API.Bible account and applicable license.

### CORS or Origin Errors

Make sure `FRONTEND_ORIGIN` exactly matches the browser origin, including protocol, hostname and port.

For example:

```text
http://localhost:5500
```

is different from:

```text
http://127.0.0.1:5500
```

### The Interface Loads but Scripture Does Not

Confirm that:

1. `bible-app.js` is linked in the HTML.
2. The Node.js proxy is running.
3. `apiBaseUrl` points to the correct proxy address.
4. `/health` responds successfully.
5. The browser Network tab shows a successful request to `/api/bible/v1/bibles`.
6. The configured Bible ID is enabled for the API key.

### `429 Too Many Requests`

The local proxy applies a request limit.

Avoid repeatedly refreshing or triggering the same request while testing. Review provider limits and tune server-side limits carefully before a larger public launch.

### Browser Reminders Do Not Appear When the App Is Closed

The current reminder checker runs in the open application.

Background notifications require additional service-worker, push-subscription and server-side scheduling infrastructure.

---

## About the Developer

Selah is developed by **Kisakye Paul — Software Developer**, with a focus on building practical, responsive and user-friendly web solutions.

I work with individuals, startups, organizations and businesses to plan, design and develop digital products that solve real problems and support growth.

### Development Services

- **Website Design and Development:** Professional, responsive websites for businesses, organizations and personal brands.
- **Custom Web Applications:** Interactive systems, dashboards, portals and workflow-based applications.
- **API Integration:** Connect websites and applications to third-party APIs and external services.
- **Business Systems:** Tailored tools for record keeping, operations, reporting and process automation.
- **Frontend Development:** Responsive interfaces using HTML, CSS, JavaScript, React and modern web technologies.
- **Website Support:** Maintenance, improvements, performance troubleshooting and technical updates.

### Have a Project in Mind?

Need a professional website, a custom business application, an API integration or a digital solution for your organization?

**Get in touch to discuss your requirements.**

| Contact      | Details                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------- |
| Developer    | **Kisakye Paul — Software Developer**                                                        |
| Email        | [kisakyepaul73@gmail.com](mailto:kisakyepaul73@gmail.com)                                    |
| WhatsApp     | [+256 774 185 964](https://wa.me/256774185964)                                               |
| Phone        | [Call +256 774 185 964](tel:+256774185964)                                                   |
| Portfolio    | [View developer portfolio](https://pauldeveloper73.github.io/Kisakye-Paul-Elite-Portifolio/) |
| Live project | [Open Selah preview](https://pauldeveloper73.github.io/bible-app/)                           |

---

## Project Notes and Attribution

- **Project Name:** Selah — Bible, Prayer & Devotion
- **Developer:** Kisakye Paul — Software Developer
- **Configured Scripture Provider:** API.Bible
- **Configured Bible ID:** `a6aee10bb058511c-02`
- **Live Preview:** [pauldeveloper73.github.io/bible-app](https://pauldeveloper73.github.io/bible-app/)

Bible text, translation names, copyright notices, API.Bible services, fonts and other third-party resources remain subject to their respective owners' terms and licenses.

Review those terms before redistributing content or using the application commercially. No permission to reuse third-party Scripture content is granted by this project README.

Unless a separate `LICENSE` file is added to this repository, do not assume that the source code is released under an open-source license.

---

<p align="center">
  <strong>Developed By: Kisakye Paul – Software Developer</strong><br>
  <a href="https://pauldeveloper73.github.io/Kisakye-Paul-Elite-Portifolio/">Portfolio</a> ·
  <a href="mailto:kisakyepaul73@gmail.com">Email</a> ·
  <a href="https://wa.me/256774185964">WhatsApp</a>
</p>

<p align="center"><em>Selah — Make room for the Word. Grow in grace, one day at a time.</em></p>
