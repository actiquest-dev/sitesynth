# SiteSynth Figma Builder Plugin

1. Open Figma → Plugins → Development → Import plugin from manifest.
2. Select `plugins/figma-builder/manifest.json`.
3. Set `PLUGIN_TOKEN` in `code.js` to match `FIGMA_PLUGIN_SECRET` in SiteSynth.
4. Keep the plugin open; it auto-polls for jobs.
5. In SiteSynth cabinet, click **Build in Figma**.

The plugin creates new pages per build:
- Build <timestamp> · Design System
- Build <timestamp> · Wireframes
- Build <timestamp> · Mockups
- Build <timestamp> · Page Map

This is the first-pass scaffold. We can extend it to render real frames, typography, and components.
