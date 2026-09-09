const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, 'reminder.md'), 'utf8').trim();

process.stdout.write(JSON.stringify({
  suppressOutput: true,
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: text,
  },
}));
