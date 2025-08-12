/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.children) : [];
  // Get all tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // First row: header row with exactly one cell, as per example
  const cells = [['Tabs (tabs9)']];

  // Each additional row: [Tab Label, Tab Content]
  for (let i = 0; i < tabItems.length; i++) {
    const tabLabel = tabItems[i]?.textContent?.trim() || '';
    // Find the panel for this tab
    let tabPanel = null;
    const ariaControls = tabItems[i]?.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabsRoot.querySelector(`#${ariaControls}`);
    }
    if (!tabPanel && tabPanels[i]) {
      tabPanel = tabPanels[i];
    }
    // Prefer to reference the main content within the panel, but if empty, use the panel itself
    let tabContent;
    if (tabPanel) {
      const mainPanelContent = tabPanel.firstElementChild || tabPanel;
      tabContent = mainPanelContent;
    } else {
      tabContent = '';
    }
    // Each row after header should be two columns
    cells.push([tabLabel, tabContent]);
  }

  // Now create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Ensure header row spans columns to match example
  const headerRow = block.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1 && cells.length > 1) {
    headerRow.firstElementChild.setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
