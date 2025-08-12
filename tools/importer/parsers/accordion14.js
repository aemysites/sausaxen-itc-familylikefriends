/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches example
  const headerRow = ['Accordion (accordion14)'];
  const cells = [headerRow];

  // Get all accordion items directly
  const accordionItems = element.querySelectorAll('.cmp-accordion__item');

  accordionItems.forEach(item => {
    // Title cell: reference the <span class="cmp-accordion__title"> element
    let titleEl = item.querySelector('.cmp-accordion__title');
    if (!titleEl) {
      // fallback: use header text
      const header = item.querySelector('.cmp-accordion__header');
      if (header) {
        // Get text content directly (less ideal, but ensures something shown)
        titleEl = document.createElement('span');
        titleEl.textContent = header.textContent.trim();
      } else {
        titleEl = document.createElement('span');
        titleEl.textContent = '';
      }
    }

    // Content cell: reference all panel children (body/content of accordion)
    let contentPanel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (contentPanel) {
      // Extract all children (preserving structure and formatting)
      const children = Array.from(contentPanel.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // If panel is empty, provide empty div
        contentCell = document.createElement('div');
      }
    } else {
      // No panel found, fallback to empty div
      contentCell = document.createElement('div');
    }

    cells.push([titleEl, contentCell]);
  });

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}