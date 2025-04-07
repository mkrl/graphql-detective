import { $usageSchema, type UsageSchema } from './store.ts'

const create = (tag: string, className: string) => {
  const element = document.createElement(tag)
  element.className = className
  return element
}

export const createUsageSchemaViewer = (
  container: HTMLElement,
  schema: UsageSchema,
) => {
  // Create container with shadow DOM
  const shadow = container.attachShadow({ mode: 'open' })

  // Create stylesheet
  const styleSheet = new CSSStyleSheet()
  // language=CSS
  styleSheet.replaceSync(`
      .schema-container {
          font-family: monospace;
          color: black;
          padding: 12px;
          border-radius: 4px;
          background: #f8f8f8;
          max-height: 80vh;
          min-width: 20vw;
          overflow: auto;
      }

      .schema-item {
          margin: 2px 0;
      }

      .schema-key {
          display: flex;
          align-items: center;
      }

      .schema-true {
          color: #22863a;
      }

      .schema-false {
          color: #cb2431;
      }

      .schema-object {
          padding-left: 16px;
          border-left: 1px dashed #ddd;
          margin-left: 4px;
      }

      .schema-object:has(.schema-false) {
          background-color: #ffe8ea;
      }

      .schema-object:not(:has(.schema-false)) {
          background-color: #f1ffe8;
      }

      .schema-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
      }

      .schema-bullet-true {
          background-color: #22863a;
      }

      .schema-bullet-false {
          background-color: #cb2431;
      }

      .collapsible {
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          background-color: #eaeaea;
          display: flex;
          align-items: center;
          user-select: none;
      }

      .collapsible:hover {
          background-color: #e0e0e0;
      }

      .collapsible-icon, .collapsible-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 6px;
          text-align: center;
          line-height: 12px;
          font-size: 12px;
      }
      
      .collapsible-indicator {
          margin-left: 6px;
      }

      .collapsed .collapsible-icon::before {
          content: "▶";
      }

      .expanded .collapsible-icon::before {
          content: "▼";
      }

      .collapsed + .schema-object {
          display: none;
      }

      .expanded + .schema-object {
          display: block;
      }

      .collapsible-indicator::before {
          content: "⬤";
      }
      .collapsible-indicator {
          display: none;
      }

      .schema-collapse:has(.schema-false) .collapsible-indicator {
          color: #cb2431;
          display: inline-block;
      }
  `)
  shadow.adoptedStyleSheets = [styleSheet]

  // Create root container
  const rootContainer = document.createElement('div')
  rootContainer.className = 'schema-container'
  shadow.appendChild(rootContainer)

  // Return an object with methods to update the UI
  return {
    shadow,
    rootContainer,
    update: (newSchema: UsageSchema) => {
      // Clear existing content
      rootContainer.innerHTML = ''
      // Build new content
      buildTopLevelSchemas(newSchema, rootContainer)
    },
  }
}

// Handle first-level schemas as collapsible elements
const buildTopLevelSchemas = (obj: UsageSchema, parent: HTMLElement) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object') {
      // Create a collapsible container for each top-level schema
      const schemaItem = document.createElement('div')
      schemaItem.className = 'schema-collapse'

      // Create header that can be clicked to expand/collapse
      const header = document.createElement('div')
      header.className = 'collapsible collapsed'

      const icon = document.createElement('span')
      icon.className = 'collapsible-icon'
      header.appendChild(icon)

      const titleText = document.createElement('span')
      titleText.textContent = key
      header.appendChild(titleText)

      const indicator = document.createElement('span')
      indicator.className = 'collapsible-indicator'
      header.appendChild(indicator)

      // Toggle expanded/collapsed state on click
      header.addEventListener('click', () => {
        if (header.classList.contains('expanded')) {
          header.classList.remove('expanded')
          header.classList.add('collapsed')
        } else {
          header.classList.remove('collapsed')
          header.classList.add('expanded')
        }
      })

      schemaItem.appendChild(header)

      // Create container for schema contents
      const childContainer = document.createElement('div')
      childContainer.className = 'schema-object'

      // Build the nested schema UI
      buildSchemaUI(value, childContainer)

      schemaItem.appendChild(childContainer)
      parent.appendChild(schemaItem)
    } else {
      // Handle basic boolean values at top level (unlikely but possible)
      const itemElement = document.createElement('div')
      itemElement.className = 'schema-item'

      const keyElement = document.createElement('div')
      keyElement.className = 'schema-key'

      const bulletElement = document.createElement('span')
      bulletElement.className = `schema-bullet schema-bullet-${value}`
      keyElement.appendChild(bulletElement)

      const keyText = document.createElement('span')
      keyText.textContent = key
      keyText.className = value ? 'schema-true' : 'schema-false'
      keyElement.appendChild(keyText)

      itemElement.appendChild(keyElement)
      parent.appendChild(itemElement)
    }
  })
}

// Build the schema UI recursively for nested elements
const buildSchemaUI = (obj: UsageSchema, parent: HTMLElement) => {
  Object.entries(obj).forEach(([key, value]) => {
    const itemElement = document.createElement('div')
    itemElement.className = 'schema-item'

    const keyElement = document.createElement('div')
    keyElement.className = 'schema-key'

    if (typeof value === 'boolean') {
      // Create bullet indicator
      const bulletElement = document.createElement('span')
      bulletElement.className = `schema-bullet schema-bullet-${value}`
      keyElement.appendChild(bulletElement)

      // Create key text with color
      const keyText = document.createElement('span')
      keyText.textContent = key
      keyText.className = value ? 'schema-true' : 'schema-false'
      keyElement.appendChild(keyText)

      itemElement.appendChild(keyElement)
    } else {
      // It's an object - create expandable section
      keyElement.textContent = key
      itemElement.appendChild(keyElement)

      const childContainer = document.createElement('div')
      childContainer.className = 'schema-object'
      itemElement.appendChild(childContainer)

      // Recursively build children
      buildSchemaUI(value, childContainer)
    }

    parent.appendChild(itemElement)
  })
}

// Keep track of the viewer instance for updates
let schemaViewer: { update: (schema: UsageSchema) => void } | null = null

export const createDetectiveUI = () => {
  let containerElement = document.getElementById('graphql-detective-ui')

  if (containerElement === null) {
    containerElement = create('div', 'graphql-detective-ui')
    document.body.appendChild(containerElement)
    containerElement.style.position = 'fixed'
    containerElement.style.top = '2%'
    containerElement.style.right = '2%'

    // Initialize the viewer once
    const schema = $usageSchema.get()
    schemaViewer = createUsageSchemaViewer(containerElement, schema)

    // Initial render
    schemaViewer.update(schema)
    $usageSchema.subscribe((newSchema) => {
      schemaViewer?.update(newSchema)
    })
  } else {
    // Just update with the latest schema
    if (schemaViewer) {
      schemaViewer.update($usageSchema.get())
    }
  }
}
