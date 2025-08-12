/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have exactly one column and match the example
  const headerRow = ['Tabs (tabs8)'];

  // Get all tab buttons and tab panels in order
  const tablist = element.querySelector('[role="tablist"]');
  const tabButtons = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));

  // Helper to extract visible tab content
  function getTabContent(tabPanel) {
    const contents = [];
    Array.from(tabPanel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'INPUT' && node.hasAttribute('hidden')) return;
        if (node.tagName === 'H2' && !node.textContent.trim()) return;
        contents.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contents.push(document.createTextNode(node.textContent));
      }
    });
    // Fallback: tabPanel itself
    return contents.length ? (contents.length === 1 ? contents[0] : contents) : tabPanel;
  }

  // Each row (after the header) must have exactly two columns: [tab label, tab content]
  const rows = tabButtons.map((tabBtn, idx) => {
    const tabLabel = tabBtn.textContent.trim();
    let tabPanel = null;
    const ariaControls = tabBtn.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = element.querySelector(`#${ariaControls}`);
    }
    if (!tabPanel && tabPanels.length > idx) {
      tabPanel = tabPanels[idx];
    }
    const tabContent = tabPanel ? getTabContent(tabPanel) : '';
    return [tabLabel, tabContent];
  });

  // Compose final cells: header row (single column), then each row (2 columns)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
