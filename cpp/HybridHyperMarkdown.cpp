#include "HybridHyperMarkdown.hpp"
#include "MarkdownParser.h"
#include <sstream>
#include <iomanip>

namespace margelo::nitro::hypermarkdown {

std::string HybridHyperMarkdown::escapeJson(const std::string& str) {
    std::ostringstream oss;
    for (char c : str) {
        switch (c) {
            case '"': oss << "\\\""; break;
            case '\\': oss << "\\\\"; break;
            case '\b': oss << "\\b"; break;
            case '\f': oss << "\\f"; break;
            case '\n': oss << "\\n"; break;
            case '\r': oss << "\\r"; break;
            case '\t': oss << "\\t"; break;
            default:
                if ('\x00' <= c && c <= '\x1f') {
                    oss << "\\u" << std::hex << std::setw(4) << std::setfill('0') << static_cast<int>(c);
                } else {
                    oss << c;
                }
        }
    }
    return oss.str();
}

std::string HybridHyperMarkdown::nodeToJson(const std::shared_ptr<MarkdownNode>& node) {
    if (!node) {
        return "null";
    }
    
    std::ostringstream oss;
    oss << "{";
    
    // Type
    oss << "\"type\":\"" << escapeJson(node->type) << "\"";
    
    // Content (if present)
    if (node->content) {
        oss << ",\"content\":\"" << escapeJson(*node->content) << "\"";
    }
    
    // Level (for headings)
    if (node->level) {
        oss << ",\"level\":" << *node->level;
    }
    
    // Link/Image properties
    if (node->href) {
        oss << ",\"href\":\"" << escapeJson(*node->href) << "\"";
    }
    if (node->src) {
        oss << ",\"src\":\"" << escapeJson(*node->src) << "\"";
    }
    if (node->alt) {
        oss << ",\"alt\":\"" << escapeJson(*node->alt) << "\"";
    }
    if (node->title) {
        oss << ",\"title\":\"" << escapeJson(*node->title) << "\"";
    }
    
    // Code block language
    if (node->language) {
        oss << ",\"language\":\"" << escapeJson(*node->language) << "\"";
    }
    
    // List properties
    if (node->ordered) {
        oss << ",\"ordered\":" << (*node->ordered ? "true" : "false");
    }
    if (node->start) {
        oss << ",\"start\":" << *node->start;
    }
    
    // Task list item
    if (node->checked) {
        oss << ",\"checked\":" << (*node->checked ? "true" : "false");
    }
    
    // Table cell
    if (node->align) {
        std::string alignStr;
        switch (*node->align) {
            case TableCellAlign::Left: alignStr = "left"; break;
            case TableCellAlign::Center: alignStr = "center"; break;
            case TableCellAlign::Right: alignStr = "right"; break;
            default: alignStr = "default"; break;
        }
        oss << ",\"align\":\"" << alignStr << "\"";
    }
    if (node->isHeader) {
        oss << ",\"isHeader\":" << (*node->isHeader ? "true" : "false");
    }
    
    // Children
    if (!node->children.empty()) {
        oss << ",\"children\":[";
        bool first = true;
        for (const auto& child : node->children) {
            if (!first) oss << ",";
            first = false;
            oss << nodeToJson(child);
        }
        oss << "]";
    }
    
    oss << "}";
    return oss.str();
}

ParseResultNative HybridHyperMarkdown::parse(const std::string& content, const std::optional<::margelo::nitro::hypermarkdown::ParserOptions>& options) {
    // Convert Nitro ParserOptions to internal parser options
    margelo::nitro::hypermarkdown::ParserOptions internalOptions;
    
    // Destructure options with defaults
    bool gfm = true;
    bool enableTables = true;
    bool enableTaskLists = true;
    bool enableStrikethrough = true;
    bool enableAutolink = true;
    bool math = false;
    bool wiki = false;
    size_t maxInputSize = 10 * 1024 * 1024; // 10MB
    int timeout = 5000;
    
    if (options) {
        if (options->gfm) gfm = *options->gfm;
        if (options->enableTables) enableTables = *options->enableTables;
        if (options->enableTaskLists) enableTaskLists = *options->enableTaskLists;
        if (options->enableStrikethrough) enableStrikethrough = *options->enableStrikethrough;
        if (options->enableAutolink) enableAutolink = *options->enableAutolink;
        if (options->math) math = *options->math;
        if (options->wiki) wiki = *options->wiki;
        if (options->maxInputSize) maxInputSize = static_cast<size_t>(*options->maxInputSize);
        if (options->timeout) timeout = static_cast<int>(*options->timeout);
    }
    
    // Check input size
    if (content.size() > maxInputSize) {
        return ParseResultNative(
            false,
            "[]",
            std::optional<std::string>("Input exceeds maximum size limit"),
            std::nullopt,
            std::nullopt
        );
    }
    
    // Handle empty content
    if (content.empty()) {
        return ParseResultNative(
            true,
            "[{\"type\":\"document\",\"children\":[]}]",
            std::nullopt,
            std::nullopt,
            std::nullopt
        );
    }
    
    // Create internal parser options struct
    InternalParserOptions parserOpts;
    parserOpts.gfm = gfm;
    parserOpts.enableTables = enableTables;
    parserOpts.enableTaskLists = enableTaskLists;
    parserOpts.enableStrikethrough = enableStrikethrough;
    parserOpts.enableAutolink = enableAutolink;
    parserOpts.math = math;
    parserOpts.wiki = wiki;
    parserOpts.maxInputSize = maxInputSize;
    parserOpts.timeout = timeout;
    
    // Parse using MarkdownParser
    auto result = MarkdownParser::parse(content, parserOpts);
    
    if (!result.success) {
        std::string errorMsg = result.error ? result.error->message : "Unknown parse error";
        std::optional<double> errorLine = std::nullopt;
        std::optional<double> errorColumn = std::nullopt;
        
        if (result.error) {
            if (result.error->line) errorLine = static_cast<double>(*result.error->line);
            if (result.error->column) errorColumn = static_cast<double>(*result.error->column);
        }
        
        return ParseResultNative(
            false,
            "[]",
            std::optional<std::string>(errorMsg),
            errorLine,
            errorColumn
        );
    }
    
    // Convert AST to JSON
    std::ostringstream jsonOss;
    jsonOss << "[";
    bool first = true;
    for (const auto& node : result.nodes) {
        if (!first) jsonOss << ",";
        first = false;
        jsonOss << nodeToJson(node);
    }
    jsonOss << "]";
    
    return ParseResultNative(
        true,
        jsonOss.str(),
        std::nullopt,
        std::nullopt,
        std::nullopt
    );
}

} // namespace margelo::nitro::hypermarkdown
