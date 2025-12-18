interface RichTextContentProps {
  content: any;
}

export default function RichTextContent({ content }: RichTextContentProps) {
  if (!content?.root?.children) {
    return <div className="text-gray-400 italic">محتوی خالی</div>;
  }

  const renderNode = (node: any, index: number) => {
    if (!node) return null;

    switch (node.type) {
      case "heading":
        const level = node.level || 2;

        if (level === 1) {
          return (
            <h1
              key={index}
              className="mb-4 mt-6 text-3xl font-bold text-gray-900"
            >
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </h1>
          );
        } else if (level === 2) {
          return (
            <h2
              key={index}
              className="mb-4 mt-6 text-2xl font-bold text-gray-900"
            >
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </h2>
          );
        } else if (level === 3) {
          return (
            <h3
              key={index}
              className="mb-4 mt-6 text-xl font-bold text-gray-900"
            >
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </h3>
          );
        } else {
          return (
            <h4
              key={index}
              className="mb-4 mt-6 text-lg font-bold text-gray-900"
            >
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </h4>
          );
        }

      case "paragraph":
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {node.children?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </p>
        );

      case "list":
        const ListTag = node.listType === "bullet" ? "ul" : "ol";
        return (
          <ListTag
            key={index}
            className={`mb-4 ${ListTag === "ul" ? "list-disc" : "list-decimal"} pr-4`}
          >
            {node.children?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex} className="mb-2 text-gray-700">
                {listItem.children?.map((child: any, childIndex: number) =>
                  renderNode(child, childIndex)
                )}
              </li>
            ))}
          </ListTag>
        );

      case "list-item":
        return (
          <span key={index}>
            {node.children?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </span>
        );

      case "text":
        let textElement = node.text || "";

        if (node.bold) {
          textElement = <strong key={index}>{textElement}</strong>;
        }
        if (node.italic) {
          textElement = <em key={index}>{textElement}</em>;
        }
        if (node.underline) {
          textElement = <u key={index}>{textElement}</u>;
        }
        if (node.code) {
          textElement = (
            <code key={index} className="bg-gray-100 px-1 rounded">
              {textElement}
            </code>
          );
        }

        return textElement;

      case "link":
        return (
          <a
            key={index}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            {node.children?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </a>
        );

      default:
        return <span key={index}>{JSON.stringify(node)}</span>;
    }
  };

  return (
    <div className="text-justify">
      {content.root.children.map((node: any, index: number) =>
        renderNode(node, index)
      )}
    </div>
  );
}
