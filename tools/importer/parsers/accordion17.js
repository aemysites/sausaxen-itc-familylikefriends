/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACTLY as specified
  const headerRow = ['Accordion (accordion17)'];
  const rows = [headerRow];

  // 2. Extract title: Find the button > .cmp-accordion__title (the label seen in screenshot)
  let titleText = '';
  let titleNode = null;
  const button = element.querySelector('.cmp-accordion__button');
  if (button) {
    // Use the inner span for the title text
    const titleSpan = button.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
      // Reference the actual DOM node for semantic correctness
      titleNode = titleSpan;
    } else {
      titleText = button.textContent.trim();
      // Use button itself if no span
      titleNode = button;
    }
  } else {
    // Edge case: fallback to h3 or any heading
    const h3 = element.querySelector('h3');
    if (h3) {
      titleText = h3.textContent.trim();
      titleNode = h3;
    } else {
      // Fallback: grab first child text
      titleText = element.textContent.trim();
      titleNode = document.createTextNode(titleText);
    }
  }

  // 3. Extract content: panel div, reference existing content element
  let panelContentEl = element.querySelector('.cmp-accordion__panel');
  // Defensive: look for cmp-text inside panel, else panel itself
  let contentNode = null;
  if (panelContentEl) {
    const cmpText = panelContentEl.querySelector('.cmp-text');
    if (cmpText) {
      contentNode = cmpText;
    } else {
      contentNode = panelContentEl;
    }
  } else {
    // Fallback to element itself
    contentNode = element;
  }

  // 4. Create block table (2 cols, 2 rows total)
  rows.push([
    titleNode,
    contentNode
  ]);

  // 5. Replace with table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
