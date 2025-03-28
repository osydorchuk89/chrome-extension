import { useState } from "react";

import "./App.css";
import { getKeywords } from "./gemini";

export default function App() {
    const [error, setError] = useState<string | null>(null);
    const [fetchingResponse, setFetchingResponse] = useState(false);

    const highlightKeywords = async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        // get selected text from the content script
        chrome.tabs.sendMessage(
            tab.id!,
            { type: "GET_SELECTED_TEXT" },
            async (response) => {
                if (response) {
                    // if a user has not selected any text, show an error message
                    if (!response.selectedText) {
                        setError(
                            "Please select a fragment of text on the page."
                        );
                        return;
                    }
                    setFetchingResponse(true);
                    setError(null);
                    // send the text to Gemini API to extract keywords and their explanations
                    const result = await getKeywords(response.selectedText);
                    setFetchingResponse(false);

                    // if an error occurred during fetching keywords, show an error message
                    if (result.errorMessage || !result.keywords) {
                        setError(result.errorMessage);
                    }

                    chrome.tabs.sendMessage(tab.id!, {
                        type: "HIGHLIGHT_KEYWORDS",
                        keywords: result.keywords,
                    });
                }
            }
        );
    };

    const removeHighlights = async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        chrome.tabs.sendMessage(tab.id!, { type: "REMOVE_HIGHLIGHTS" });
    };

    return (
        <div id="app">
            <h1 className="title">Keywords Highlighter</h1>
            <div className="content-section">
                <p className="content-text">
                    This extension allows you to highlight keywords inside the
                    selected fragment of text. First, select the text on a page.
                    Second, click the button below to highlight the keywords.
                    Then, when you hover over a highlighted keyword, a popup
                    will appear with an explanation why this word was selected
                    as a keyword.
                </p>
                <button
                    className={`highlight-button ${
                        fetchingResponse ? "loading" : ""
                    }`}
                    onClick={highlightKeywords}
                >
                    {fetchingResponse ? "Please wait..." : "Highlight keywords"}
                </button>
                {error && <p className="content-error">{error}</p>}
            </div>
            <div className="content-section">
                <p className="content-text">
                    To remove the highlighted keywords, click the button below.
                </p>
                <button
                    className="unhighlight-button"
                    onClick={removeHighlights}
                >
                    Remove highlights
                </button>
            </div>
        </div>
    );
}
