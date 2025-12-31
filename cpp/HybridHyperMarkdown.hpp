#pragma once

#include <vector>
#include <string>
#include <optional>
#include "HybridHyperMarkdownSpec.hpp"
#include "MarkdownParser.h"

namespace margelo::nitro::hypermarkdown {

class HybridHyperMarkdown : public HybridHyperMarkdownSpec {
public:
    HybridHyperMarkdown() : HybridObject(TAG), HybridHyperMarkdownSpec() {}
    
    // Parse markdown content and return result with JSON AST
    ParseResultNative parse(const std::string& content, const std::optional<ParserOptions>& options) override;
    
private:
    // Convert MarkdownNode tree to JSON string
    std::string nodeToJson(const std::shared_ptr<MarkdownNode>& node);
    
    // Escape JSON string
    std::string escapeJson(const std::string& str);
    
    // Convert internal ParserOptions to MarkdownParser options
    margelo::nitro::hypermarkdown::ParserOptions convertOptions(const std::optional<ParserOptions>& options);
};

} // namespace margelo::nitro::hypermarkdown
