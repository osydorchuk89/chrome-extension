chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    try {
        if (message.type === "GET_SELECTED_TEXT") {
            const selectedText = window.getSelection()?.toString() || "";
            sendResponse({ selectedText });
        } else if (message.type === "HIGHLIGHT_KEYWORDS") {
            highlightKeywords(message.keywords);
            sendResponse({ success: true });
        } else if (message.type === "REMOVE_HIGHLIGHTS") {
            removeHighlights();
            sendResponse({ success: true });
        } else {
            console.log("Unknown message type received:");
            sendResponse({ error: "Unknown message type" });
        }
        return false;
    } catch (error) {
        console.log("Error in message handler:", error);
        sendResponse({ error: "Error in message handler" });
        return false;
    }
});

const highlightKeywords = (
    keywords: { word: string; explanation: string }[]
) => {
    if (keywords.length === 0) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents(); // Extract the selected contents

    keywords.forEach(({ word, explanation }) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");

        // Walk through each text node and replace matches with a <span> element
        const walker = document.createTreeWalker(
            contents,
            NodeFilter.SHOW_TEXT, // Only target text nodes
            null
        );

        while (walker.nextNode()) {
            const textNode = walker.currentNode as Text;

            const matches = regex.exec(textNode.textContent || "");

            if (matches) {
                const parent = textNode.parentNode;

                if (parent) {
                    // Create a span for the keyword
                    const span = document.createElement("span");
                    span.textContent = matches[0];
                    span.className = "highlighted-keyword";
                    span.style.backgroundColor = "#bfdbfe";
                    span.style.borderRadius = "5px";
                    span.style.color = "black";
                    span.style.fontWeight = "bold";
                    span.style.padding = "0 2px";
                    span.style.cursor = "pointer";
                    span.setAttribute("data-explanation", explanation);

                    // Split the text node and insert the span
                    const splitNode = textNode.splitText(matches.index);
                    splitNode.textContent = (
                        splitNode.textContent || ""
                    ).substring(matches[0].length);

                    // Insert the <span> before the remaining text
                    parent.insertBefore(span, splitNode);
                }
            }
        }
    });

    // Insert the modified content back into the range
    range.insertNode(contents);

    // Add event listeners for tooltips
    addPopupListeners();
};

const addPopupListeners = () => {
    // Find all highlighted keywords
    const highlightedElements = document.querySelectorAll(
        ".highlighted-keyword"
    );

    highlightedElements.forEach((element) => {
        element.addEventListener("mouseover", (event) => {
            showPopup(event as MouseEvent);
        });

        element.addEventListener("mouseout", () => {
            hidePopup();
        });
    });
};

const showPopup = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const explanation =
        target.getAttribute("data-explanation") || "No explanation available";

    const tooltip = document.createElement("div");
    tooltip.id = "keyword-popup";
    tooltip.textContent = explanation;
    tooltip.style.position = "absolute";
    tooltip.style.maxWidth = "300px";
    tooltip.style.lineHeight = "150%";
    tooltip.style.backgroundColor = "white";
    tooltip.style.border = "1px solid black";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    tooltip.style.zIndex = "10";

    // Position the popup near the mouse
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    tooltip.style.left = `${mouseX + 10}px`;
    tooltip.style.top = `${mouseY + 10}px`;

    // Append the popup to the body
    document.body.appendChild(tooltip);
};

const hidePopup = () => {
    // Remove the popup element
    const tooltip = document.getElementById("keyword-popup");
    if (tooltip) {
        tooltip.remove();
    }
};

const removeHighlights = () => {
    // Find all elements with the class `highlighted-keyword`
    const highlightedElements = document.querySelectorAll(
        ".highlighted-keyword"
    );

    highlightedElements.forEach((element) => {
        const parent = element.parentNode;

        if (parent) {
            // Replace the <span> element with its text content
            while (element.firstChild) {
                parent.insertBefore(element.firstChild, element);
            }

            // Remove the now-empty <span> element
            parent.removeChild(element);
        }
    });
};
