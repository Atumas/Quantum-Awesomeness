# 🎯 AppForge AI v2.0 - Production Checklist

## Pre-Launch Verification
- [ ] All API keys added to `.env.local`
- [ ] Tested on Node.js 18+
- [ ] Ran `npm run build` successfully
- [ ] Tested CLI: `npm link && appforge --help`
- [ ] Verified deployments to at least 2 platforms
- [ ] Checked analytics tracking
- [ ] Tested voice input in Chrome
- [ ] Verified error boundaries work
- [ ] Tested ZIP download functionality
- [ ] Confirmed quantum mode unlocks (Konami code)

## Security
- [ ] Rate limiting enabled on API routes
- [ ] Secrets not committed to repo
- [ ] GitHub tokens have minimal permissions
- [ ] Sentry (or similar) configured for error tracking
- [ ] CORS and headers hardened for production

## Distribution
- [ ] `npm run package:final` generates `appforge-ai-v2.0-FINAL.zip`
- [ ] `install-global.sh` and `install-global.bat` tested on at least one OS each
- [ ] `ONE-LINE-INSTALL.txt` tested from a clean machine
- [ ] GitHub repo tagged as `v2.0.0` and pushed
- [ ] Optional: CLI package published to npm (`npm publish`)
- [ ] Optional: Hugging Face Space created from final ZIP / repo
- [ ] Release notes created (GitHub Releases / Product Hunt / etc.)

## Observability
- [ ] Basic logging enabled for API routes
- [ ] Error logs monitored in production hosting
- [ ] Analytics dashboards checked after first real users

## Post-Launch
- [ ] Feedback channels set up (GitHub issues, email, etc.)
- [ ] Backlog created for v2.1 (Docker image, more platforms, etc.)
- [ ] Regular maintenance cadence defined
