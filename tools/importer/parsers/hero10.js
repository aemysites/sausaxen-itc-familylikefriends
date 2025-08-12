/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, as in example
  const headerRow = ['Hero (hero10)'];

  // Row for background image (none in provided HTML)
  const backgroundRow = [''];

  // Content row: find all heading and paragraph-style elements (h1-h6, .cmp-text, p) in element, in order
  const contentEls = [];
  // Include direct children .cmp-text (for headings)
  element.querySelectorAll('.cmp-text').forEach((el) => {
    if (el.textContent.trim()) contentEls.push(el);
  });

  // In case there are subheadings, paragraphs, or other text outside .cmp-text (robustness for variations)
  element.querySelectorAll(':scope > div, :scope > section').forEach((child) => {
    child.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p').forEach((el) => {
      if (!contentEls.includes(el) && el.textContent.trim()) {
        contentEls.push(el);
      }
    });
  });

  // Fallback: if nothing found, try all text in element
  if (contentEls.length === 0 && element.textContent.trim()) {
    const para = document.createElement('p');
    para.textContent = element.textContent.trim();
    contentEls.push(para);
  }

  const contentRow = [contentEls.length ? contentEls : ['']];

  // Compose block table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
