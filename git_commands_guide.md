# Git Commands Guide for essef-store

This guide provides the basic Git commands used to manage and push your project to GitHub.

## 1. Initialize the Repository
If the project isn't already a Git repository, initialize it:
```bash
git init
```

## 2. Add Files to the Staging Area
Add all current files in the project directory to the staging area:
```bash
git add .
```

## 3. Commit the Changes
Create a commit with a descriptive message:
```bash
git commit -m "Initial commit: Set up essef-store-v5-react-kv"
```

## 4. Set the Main Branch
Ensure the primary branch is named `main` (modern standard):
```bash
git branch -M main
```

## 5. Add the Remote Repository
Link your local repository to the GitHub repository. (Note: The URL below includes your Personal Access Token for authentication).
```bash
git remote add origin https://<YOUR_PAT>@github.com/angulartuto1987-maker/essef-store.git
```

## 6. Push to GitHub
Upload your local commits to the remote GitHub repository:
```bash
git push -u origin main
```

## Updating Code in the Future
When you make changes to your code in the future and want to update GitHub, just run these three commands:
```bash
git add .
git commit -m "Describe your changes here"
git push
```
