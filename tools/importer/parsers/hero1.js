/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as required
  const headerRow = ['Hero (hero1)'];

  // Get the image (background or decorative)
  let imageEl = null;
  const imgHolder = element.querySelector('.img_holder');
  if (imgHolder) {
    // Only use an img if present
    const img = imgHolder.querySelector('img');
    if (img) imageEl = img;
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Gather headline, subheading, and CTA
  const textBox = element.querySelector('.text_box');
  const contentRowParts = [];
  if (textBox) {
    const hTag = textBox.querySelector('h1,h2,h3,h4,h5,h6');
    if (hTag) contentRowParts.push(hTag);
    const pTag = textBox.querySelector('p');
    if (pTag) contentRowParts.push(pTag);
  }

  // Find CTA button/link
  let cta = null;
  const ctaBox = element.querySelector('.cta_box');
  if (ctaBox) {
    const aTag = ctaBox.querySelector('a');
    if (aTag) cta = aTag;
  }
  if (cta) contentRowParts.push(cta);

  // If everything is missing, provide empty string cell
  const contentRow = [contentRowParts.length ? contentRowParts : ''];

  // Compose rows
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the block
  element.replaceWith(table);
}
