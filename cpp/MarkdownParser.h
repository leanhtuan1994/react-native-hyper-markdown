#pragma once

#include <string>
#include <vector>
#include <memory>
#include <optional>
#include <stack>

extern "C" {
#include "md4c.h"
}

namespace margelo::nitro::hypermarkdown {

// Table cell alignment
enum class TableCellAlign {
    Default,
    Left,
    Center,
    Right
};

// Markdown node structure matching TypeScript types
struct MarkdownNode {
    std::string type;
    std::optional<std::string> content;
    std::vector<std::shared_ptr<MarkdownNode>> children;
    
    // Heading level (1-6)
    std::optional<int> level;
    
    // Link/Image properties
    std::optional<std::string> href;
    std::optional<std::string> src;
    std::optional<std::string> alt;
    std::optional<std::string> title;
    
    // Code block language
    std::optional<std::string> language;
    
    // List properties
    std::optional<bool> ordered;
    std::optional<int> start;
    
    // Task list item
    std::optional<bool> checked;
    
    // Table cell
    std::optional<TableCellAlign> align;
    std::optional<bool> isHeader;
    
    MarkdownNode(const std::string& nodeType) : type(nodeType) {}
};

// Parse error structure
struct ParseError {
    std::string message;
    std::optional<int> line;
    std::optional<int> column;
    
    ParseError(const std::string& msg) : message(msg) {}
    ParseError(const std::string& msg, int l, int c) : message(msg), line(l), column(c) {}
};

// Parse result
struct ParseResult {
    bool success;
    std::vector<std::shared_ptr<MarkdownNode>> nodes;
    std::optional<ParseError> error;
    
    static ParseResult Success(std::vector<std::shared_ptr<MarkdownNode>> nodes) {
        ParseResult result;
        result.success = true;
        result.nodes = std::move(nodes);
        return result;
    }
    
    static ParseResult Failure(const std::string& message) {
        ParseResult result;
        result.success = false;
        result.error = ParseError(message);
        return result;
    }
};

// Internal parser options (separate from Nitro-generated ParserOptions)
struct InternalParserOptions {
    bool gfm = true;
    bool enableTables = true;
    bool enableTaskLists = true;
    bool enableStrikethrough = true;
    bool enableAutolink = true;
    bool math = false;
    bool wiki = false;
    size_t maxInputSize = 10 * 1024 * 1024; // 10MB
    int timeout = 5000; // 5 seconds
};

// Parser context for md4c callbacks
struct ParserContext {
    std::shared_ptr<MarkdownNode> root;
    std::stack<std::shared_ptr<MarkdownNode>> nodeStack;
    std::string currentText;
    bool inCodeBlock = false;
    bool inHtmlBlock = false;
    
    ParserContext() {
        root = std::make_shared<MarkdownNode>("document");
        nodeStack.push(root);
    }
    
    std::shared_ptr<MarkdownNode> currentNode() {
        return nodeStack.top();
    }
    
    void pushNode(std::shared_ptr<MarkdownNode> node) {
        currentNode()->children.push_back(node);
        nodeStack.push(node);
    }
    
    void popNode() {
        if (nodeStack.size() > 1) {
            nodeStack.pop();
        }
    }
    
    void flushText() {
        if (!currentText.empty()) {
            auto textNode = std::make_shared<MarkdownNode>("text");
            textNode->content = currentText;
            currentNode()->children.push_back(textNode);
            currentText.clear();
        }
    }
};

// Markdown Parser class
class MarkdownParser {
public:
    static ParseResult parse(const std::string& content, const InternalParserOptions& options = InternalParserOptions());
    
private:
    static unsigned int optionsToFlags(const InternalParserOptions& options);
    
    // md4c callbacks
    static int enterBlockCallback(MD_BLOCKTYPE type, void* detail, void* userdata);
    static int leaveBlockCallback(MD_BLOCKTYPE type, void* detail, void* userdata);
    static int enterSpanCallback(MD_SPANTYPE type, void* detail, void* userdata);
    static int leaveSpanCallback(MD_SPANTYPE type, void* detail, void* userdata);
    static int textCallback(MD_TEXTTYPE type, const MD_CHAR* text, MD_SIZE size, void* userdata);
    
    // Helper methods
    static std::string blockTypeToString(MD_BLOCKTYPE type);
    static std::string spanTypeToString(MD_SPANTYPE type);
    static TableCellAlign alignFromMd4c(MD_ALIGN align);
};

} // namespace margelo::nitro::hypermarkdown
