# Backend Structure

This backend now uses `src/` as the canonical runtime code location.

## Active code

- `src/server.js`: process entrypoint (loads env, connects DB, starts server)
- `src/app.js`: Express app and middleware
- `src/config/db.js`: MongoDB connection logic
- `src/routes/`: API route modules and central route registry (`index.js`)
- `src/models/`: Mongoose models
- `src/middleware/`: middleware utilities

## Legacy code

Old or duplicate files were moved to `legacy/` to avoid confusion while preserving reference history.
