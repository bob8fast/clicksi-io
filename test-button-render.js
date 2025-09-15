// Test the button rendering logic
const buttonData = {
  type: "html",
  value: "<a href=\"/\"><--- Back</a>"
};

console.log('Testing button content conversion...');
console.log('Input:', JSON.stringify(buttonData, null, 2));

// Simulate the renderContent function
function renderContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (!content || typeof content !== 'object') {
    return '';
  }

  switch (content.type) {
    case 'html':
      return content.value || '';
    case 'text':
      return escapeHtml(content.value || '');
    default:
      return content.value || '';
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const result = renderContent(buttonData);
console.log('Output HTML:', result);
console.log('HTML length:', result.length);
console.log('Is empty?', result === '' || result === null || result === undefined);

// Test the show condition
const show_button = true;
const button = buttonData;
const shouldShow = show_button && button;
console.log('\nButton visibility test:');
console.log('show_button:', show_button);
console.log('button exists:', !!button);
console.log('shouldShow:', shouldShow);