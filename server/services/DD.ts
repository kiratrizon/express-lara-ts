class DumpAndDie {
  private static recursiveRender(value: any, level: number = 0): string {
    const indentClass = `indentation level-${level}`;

    if (Array.isArray(value)) {
      return `<div class="array scrollable ${indentClass}">
                ${value
                  .map(
                    (item) =>
                      `<div>${DumpAndDie.recursiveRender(
                        item,
                        level + 1
                      )}</div>`
                  )
                  .join("")}
            </div>`;
    } else if (value === null) {
      return `<div class="null ${indentClass}">null</div>`;
    } else if (typeof value === "object") {
      return `<div class="object scrollable ${indentClass}">
                ${Object.entries(value)
                  .map(
                    ([key, val]) =>
                      `<div><span class="object-key">${key}:</span> <span class="object-value">${DumpAndDie.recursiveRender(
                        val,
                        level + 1
                      )}</span></div>`
                  )
                  .join("")}
            </div>`;
    } else if (typeof value === "string") {
      return `<div class="string ${indentClass}">"${value}"</div>`;
    } else if (typeof value === "number") {
      return `<div class="number ${indentClass}">${value}</div>`;
    } else if (typeof value === "boolean") {
      return `<div class="boolean ${indentClass}">${value}</div>`;
    } else if (typeof value === "undefined") {
      return `<div class="undefined ${indentClass}">undefined</div>`;
    }

    return `<div>${value}</div>`;
  }

  private static generateHtmlContent(
    data: any,
    tailwindStyles: string
  ): string {
    return `
            ${tailwindStyles}
            <div class="debug">
                <pre class="data-type-wrapper">${DumpAndDie.recursiveRender(
                  data
                )}</pre>
            </div>
        `;
  }

  static sendHtmlResponse(
    res: any,
    data: any,
    tailwindStyles: string,
    shouldExit: boolean = false
  ): void {
    const htmlContent = DumpAndDie.generateHtmlContent(data, tailwindStyles);

    if (res) {
      res.set("Content-Type", "text/html");
      res.send(htmlContent);
    }

    if (shouldExit) res.end();
  }
}

const renderData = DumpAndDie.sendHtmlResponse;

export default { renderData };
