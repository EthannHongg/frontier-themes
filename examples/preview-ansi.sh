#!/usr/bin/env bash
# Print the 16 ANSI colors as seen in the integrated terminal.
# Run this inside Cursor/VS Code (not an external terminal) with a Frontier theme active.

set -euo pipefail

printf '\nFrontier Themes — integrated terminal ANSI palette\n'
printf 'Theme colors apply only inside the editor terminal.\n\n'

printf 'Standard:\n'
printf '  \033[30m██ black\033[0m   \033[31m██ red\033[0m     \033[32m██ green\033[0m   \033[33m██ yellow\033[0m\n'
printf '  \033[34m██ blue\033[0m    \033[35m██ magenta\033[0m \033[36m██ cyan\033[0m    \033[37m██ white\033[0m\n\n'

printf 'Bright:\n'
printf '  \033[90m██ bright black\033[0m  \033[91m██ bright red\033[0m    \033[92m██ bright green\033[0m  \033[93m██ bright yellow\033[0m\n'
printf '  \033[94m██ bright blue\033[0m   \033[95m██ bright magenta\033[0m \033[96m██ bright cyan\033[0m    \033[97m██ bright white\033[0m\n\n'

printf 'Backgrounds (foreground black on each):\n'
for code in 40 41 42 43 44 45 46 47; do
  printf '\033[30;${code}m bg \033[0m  '
done
printf '\n\n'

printf 'Sample output (git/npm style):\n'
printf '  \033[32m✓\033[0m generate complete\n'
printf '  \033[33m!\033[0m warning: deprecated API\n'
printf '  \033[31m✗\033[0m error: module not found\n'
printf '  \033[36minfo:\033[0m OpenAI Dark active\n\n'
