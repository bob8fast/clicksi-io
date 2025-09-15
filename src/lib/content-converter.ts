// Content converter for different formats
export function convertContentToHtml(content: string | { type: string; value: any }): string {
  if (typeof content === 'string') {
    return content;
  }

  if (!content || typeof content !== 'object') {
    return '';
  }

  switch (content.type) {
    case 'html':
      return content.value || '';

    case 'json':
      // Convert JSON tree to HTML
      return convertJsonTreeToHtml(content.value);

    case 'text':
      return escapeHtml(content.value || '');

    default:
      // Fallback: if it has a value property, use it
      return content.value || '';
  }
}

function convertJsonTreeToHtml(nodes: any): string {
  if (!nodes) return '';

  if (Array.isArray(nodes)) {
    return nodes.map(node => convertNodeToHtml(node)).join('');
  }

  return convertNodeToHtml(nodes);
}

function convertNodeToHtml(node: any): string {
  if (!node) return '';

  // Text node
  if (node.type === 'text') {
    return escapeHtml(node.text || '');
  }

  // Element node
  if (node.type === 'element' && node.tag) {
    const tag = node.tag;
    const attributes = node.attributes || {};
    const children = node.children || [];

    // Build attributes string
    const attributeString = Object.entries(attributes)
      .map(([key, value]) => {
        const escapedValue = escapeHtml(String(value));
        return `${key}="${escapedValue}"`;
      })
      .join(' ');

    // Build children HTML
    const childrenHtml = children
      .map((child: any) => convertNodeToHtml(child))
      .join('');

    // Self-closing tags
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    if (selfClosingTags.includes(tag.toLowerCase())) {
      return `<${tag}${attributeString ? ' ' + attributeString : ''} />`;
    }

    return `<${tag}${attributeString ? ' ' + attributeString : ''}>${childrenHtml}</${tag}>`;
  }

  return '';
}

function escapeHtml(text: string): string {
  // Client-side safe escape function
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  // Fallback for server-side
  return escapeHtmlServer(text);
}

// For server-side rendering
export function escapeHtmlServer(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Server-side version of the converter
export function convertContentToHtmlServer(content: string | { type: string; value: any }): string {
  if (typeof content === 'string') {
    return content;
  }

  if (!content || typeof content !== 'object') {
    return '';
  }

  switch (content.type) {
    case 'html':
      return content.value || '';

    case 'json':
      return convertJsonTreeToHtmlServer(content.value);

    case 'text':
      return escapeHtmlServer(content.value || '');

    default:
      return content.value || '';
  }
}

function convertJsonTreeToHtmlServer(nodes: any): string {
  if (!nodes) return '';

  if (Array.isArray(nodes)) {
    return nodes.map(node => convertNodeToHtmlServer(node)).join('');
  }

  return convertNodeToHtmlServer(nodes);
}

function convertNodeToHtmlServer(node: any): string {
  if (!node) return '';

  // Text node
  if (node.type === 'text') {
    return escapeHtmlServer(node.text || '');
  }

  // Element node
  if (node.type === 'element' && node.tag) {
    const tag = node.tag;
    const attributes = node.attributes || {};
    const children = node.children || [];

    // Build attributes string
    const attributeString = Object.entries(attributes)
      .map(([key, value]) => {
        const escapedValue = escapeHtmlServer(String(value));
        return `${key}="${escapedValue}"`;
      })
      .join(' ');

    // Build children HTML
    const childrenHtml = children
      .map((child: any) => convertNodeToHtmlServer(child))
      .join('');

    // Self-closing tags
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    if (selfClosingTags.includes(tag.toLowerCase())) {
      return `<${tag}${attributeString ? ' ' + attributeString : ''} />`;
    }

    return `<${tag}${attributeString ? ' ' + attributeString : ''}>${childrenHtml}</${tag}>`;
  }

  return '';
}