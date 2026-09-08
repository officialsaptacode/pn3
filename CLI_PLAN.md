# Boilerplate to CLI Transformation Plan

To achieve a true "run a command and get a fresh, up-to-date project" workflow (like `create-next-app` or `create-t3-app`), we will transform this repository.

## Phase 1: Perfect the Base System (Do this first)
Before we wrap this into a CLI, the boilerplate needs to be flawless:
1. Fix the existing build bugs (Prisma generation, TanStack route errors, Next.js proxy config).
2. Upgrade to **Enterprise Auth (Clerk)** across `web`, `admin`, and `server`.

## Phase 2: Create the CLI Scaffold
1. **Restructure**: Move `apps/` and `packages/` (the boilerplate code) into a new directory: `cli/template/`.
2. **Build the CLI**: Create a Node CLI package (e.g., `create-shadow-app`) in the repository.
3. **CLI Logic**: 
   - Prompt user for `Project Name`.
   - Copy the `cli/template/` folder to the target directory.
   - Parse all `package.json` files in the template. Instead of hardcoding versions, the CLI will dynamically fetch the `latest` version for core packages (Next.js, NestJS, Tailwind, etc.) or just run `pnpm update` post-install.
   - Update `package.json` project names to match the user's input.
   - Initialize a fresh git repository and run `pnpm install`.
4. **Publish**: You can publish this CLI to npm (e.g., `npx create-shadow-stack`) or run it globally from the repo.
