import React, { useState, useEffect } from "react";
import "./styles.scss";
import marked from "marked";

import { Card, CardBody, CardHeader } from "reactstrap";

export default function App() {
  const firstLoadTemplate = `
  # Heading 1\n 
  ## Heading2\n 
  ### Heading3\n 
  #### Heading4\n 
  ##### Heading5\n 
  ###### Heading6\n
  [Learn more]('https://www.markdownguide.org/getting-started/')\n
  Here's a python hello-world\n
  \`print("Hello, world!)\`\n
  Here's how you write a function in python\n
  \`\`\`\n
  def fun():\n
  \treturn "Hello, world!"\n
  \`\`\`\n

  * Unordered listitem 1\n
  * Unordered listitem 2\n
  * Unordered listitem 3\n
  
  1. Ordered listitem 1\n
  1. Ordered listitem 2\n
  1. Ordered listitem 3\n

  >> I would rather die having spoken after my manner, than speak in your manner and live.\n
  >> _Plato_\n

  **Wanna see something really bold?**
  Here's a *cat* image\n

  ![Cat]('https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg') \n

  `;

  const [markInput, setMarkInput] = useState(firstLoadTemplate);

  useEffect(() => {
    setMarkInput(firstLoadTemplate);
  }, []);

  return (
    <div className="App">
      <Card style={{ display: "flex", justifyContent: "space-evenly" }}>
        <CardBody>
          <CardHeader style={{ textAlign: "center" }}>Markdown</CardHeader>
          <textarea
            id="editor"
            className="text"
            value={markInput}
            onChange={(e) => setMarkInput(e.target.value)}
          />
        </CardBody>
        <CardBody>
          <CardHeader style={{ textAlign: "center" }}>Preview</CardHeader>
          <div
            id="preview"
            dangerouslySetInnerHTML={{ __html: marked(markInput) }}
            className="markout"
          />
        </CardBody>
      </Card>
    </div>
  );
}
