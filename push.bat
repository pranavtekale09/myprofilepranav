@echo off
SET PATH=%PATH%;C:\Program Files\Git\bin
echo.
echo === Pushing to GitHub ===
echo.
git add .
git commit -m "update portfolio"
git push
echo.
echo === Done! Netlify will redeploy in ~30 seconds ===
echo Visit: https://myprofilepranav.netlify.app/
echo.
pause
