#include "MarkdownParser.h"
#include <cstring>

namespace margelo::nitro::hypermarkdown {

unsigned int MarkdownParser::optionsToFlags(const InternalParserOptions& options) {
    unsigned int flags = 0;
    
    if (options.gfm || options.enableTables) {
        flags |= MD_FLAG_TABLES;
    }
    
    if (options.gfm || options.enableTaskLists) {
        flags |= MD_FLAG_TASKLISTS;
    }
    
    if (options.gfm || options.enableStrikethrough) {
        flags |= MD_FLAG_STRIKETHROUGH;
    }
    
    if (options.gfm || options.enableAutolink) {
        flags |= MD_FLAG_PERMISSIVEURLAUTOLINKS;
        flags |= MD_FLAG_PERMISSIVEEMAILAUTOLINKS;
        flags |= MD_FLAG_PERMISSIVEWWWAUTOLINKS;
    }
    
    if (options.math) {
        flags |= MD_FLAG_LATEXMATHSPANS;
    }
    
    if (options.wiki) {
        flags |= MD_FLAG_WIKILINKS;
    }
    
    // Always collapse whitespace for cleaner output
    flags |= MD_FLAG_COLLAPSEWHITESPACE;
    
    return flags;
}

std::string MarkdownParser::blockTypeToString(MD_BLOCKTYPE type) {
    switch (type) {
        case MD_BLOCK_DOC: return "document";
        case MD_BLOCK_QUOTE: return "blockquote";
        case MD_BLOCK_UL: return "list";
        case MD_BLOCK_OL: return "list";
        case MD_BLOCK_LI: return "list_item";
        case MD_BLOCK_HR: return "thematic_break";
        case MD_BLOCK_H: return "heading";
        case MD_BLOCK_CODE: return "code_block";
        case MD_BLOCK_HTML: return "html_block";
        case MD_BLOCK_P: return "paragraph";
        case MD_BLOCK_TABLE: return "table";
        case MD_BLOCK_THEAD: return "table_head";
        case MD_BLOCK_TBODY: return "table_body";
        case MD_BLOCK_TR: return "table_row";
        case MD_BLOCK_TH: return "table_cell";
        case MD_BLOCK_TD: return "table_cell";
        default: return "unknown";
    }
}

std::string MarkdownParser::spanTypeToString(MD_SPANTYPE type) {
    switch (type) {
        case MD_SPAN_EM: return "emphasis";
        case MD_SPAN_STRONG: return "strong";
        case MD_SPAN_A: return "link";
        case MD_SPAN_IMG: return "image";
        case MD_SPAN_CODE: return "code_inline";
        case MD_SPAN_DEL: return "strikethrough";
        case MD_SPAN_LATEXMATH: return "math_inline";
        case MD_SPAN_LATEXMATH_DISPLAY: return "math_block";
        case MD_SPAN_WIKILINK: return "wiki_link";
        case MD_SPAN_U: return "underline";
        default: return "unknown";
    }
}

TableCellAlign MarkdownParser::alignFromMd4c(MD_ALIGN align) {
    switch (align) {
        case MD_ALIGN_LEFT: return TableCellAlign::Left;
        case MD_ALIGN_CENTER: return TableCellAlign::Center;
        case MD_ALIGN_RIGHT: return TableCellAlign::Right;
        default: return TableCellAlign::Default;
    }
}

int MarkdownParser::enterBlockCallback(MD_BLOCKTYPE type, void* detail, void* userdata) {
    auto* ctx = static_cast<ParserContext*>(userdata);
    ctx->flushText();
    
    // Skip document block as we already have root
    if (type == MD_BLOCK_DOC) {
        return 0;
    }
    
    auto node = std::make_shared<MarkdownNode>(blockTypeToString(type));
    
    switch (type) {
        case MD_BLOCK_H: {
            auto* h = static_cast<MD_BLOCK_H_DETAIL*>(detail);
            node->level = h->level;
            break;
        }
        case MD_BLOCK_CODE: {
            auto* code = static_cast<MD_BLOCK_CODE_DETAIL*>(detail);
            if (code->lang.size > 0) {
                node->language = std::string(code->lang.text, code->lang.size);
            }
            ctx->inCodeBlock = true;
            break;
        }
        case MD_BLOCK_OL: {
            auto* ol = static_cast<MD_BLOCK_OL_DETAIL*>(detail);
            node->ordered = true;
            node->start = ol->start;
            break;
        }
        case MD_BLOCK_UL: {
            node->ordered = false;
            break;
        }
        case MD_BLOCK_LI: {
            auto* li = static_cast<MD_BLOCK_LI_DETAIL*>(detail);
            if (li->is_task) {
                node->type = "task_list_item";
                node->checked = (li->task_mark == 'x' || li->task_mark == 'X');
            }
            break;
        }
        case MD_BLOCK_TH: {
            auto* th = static_cast<MD_BLOCK_TD_DETAIL*>(detail);
            node->isHeader = true;
            node->align = alignFromMd4c(th->align);
            break;
        }
        case MD_BLOCK_TD: {
            auto* td = static_cast<MD_BLOCK_TD_DETAIL*>(detail);
            node->isHeader = false;
            node->align = alignFromMd4c(td->align);
            break;
        }
        case MD_BLOCK_HTML: {
            ctx->inHtmlBlock = true;
            break;
        }
        default:
            break;
    }
    
    ctx->pushNode(node);
    return 0;
}

int MarkdownParser::leaveBlockCallback(MD_BLOCKTYPE type, void* detail, void* userdata) {
    auto* ctx = static_cast<ParserContext*>(userdata);
    ctx->flushText();
    
    // Skip document block
    if (type == MD_BLOCK_DOC) {
        return 0;
    }
    
    if (type == MD_BLOCK_CODE) {
        // For code blocks, set the accumulated text as content
        auto node = ctx->currentNode();
        if (!ctx->currentText.empty()) {
            node->content = ctx->currentText;
            ctx->currentText.clear();
        }
        ctx->inCodeBlock = false;
    }
    
    if (type == MD_BLOCK_HTML) {
        auto node = ctx->currentNode();
        if (!ctx->currentText.empty()) {
            node->content = ctx->currentText;
            ctx->currentText.clear();
        }
        ctx->inHtmlBlock = false;
    }
    
    ctx->popNode();
    return 0;
}

int MarkdownParser::enterSpanCallback(MD_SPANTYPE type, void* detail, void* userdata) {
    auto* ctx = static_cast<ParserContext*>(userdata);
    ctx->flushText();
    
    auto node = std::make_shared<MarkdownNode>(spanTypeToString(type));
    
    switch (type) {
        case MD_SPAN_A: {
            auto* a = static_cast<MD_SPAN_A_DETAIL*>(detail);
            if (a->href.size > 0) {
                node->href = std::string(a->href.text, a->href.size);
            }
            if (a->title.size > 0) {
                node->title = std::string(a->title.text, a->title.size);
            }
            break;
        }
        case MD_SPAN_IMG: {
            auto* img = static_cast<MD_SPAN_IMG_DETAIL*>(detail);
            if (img->src.size > 0) {
                node->src = std::string(img->src.text, img->src.size);
            }
            if (img->title.size > 0) {
                node->title = std::string(img->title.text, img->title.size);
            }
            break;
        }
        case MD_SPAN_WIKILINK: {
            auto* wiki = static_cast<MD_SPAN_WIKILINK_DETAIL*>(detail);
            if (wiki->target.size > 0) {
                node->href = std::string(wiki->target.text, wiki->target.size);
            }
            break;
        }
        default:
            break;
    }
    
    ctx->pushNode(node);
    return 0;
}

int MarkdownParser::leaveSpanCallback(MD_SPANTYPE type, void* detail, void* userdata) {
    auto* ctx = static_cast<ParserContext*>(userdata);
    ctx->flushText();
    
    // For code_inline, set content from accumulated text
    if (type == MD_SPAN_CODE || type == MD_SPAN_LATEXMATH || type == MD_SPAN_LATEXMATH_DISPLAY) {
        auto node = ctx->currentNode();
        // Content should already be in children as text node, but we can also capture it
    }
    
    // For image, capture alt text from children
    if (type == MD_SPAN_IMG) {
        auto node = ctx->currentNode();
        // Collect alt text from text children
        std::string altText;
        for (const auto& child : node->children) {
            if (child->type == "text" && child->content) {
                altText += *child->content;
            }
        }
        if (!altText.empty()) {
            node->alt = altText;
            node->children.clear(); // Images don't have children in our AST
        }
    }
    
    ctx->popNode();
    return 0;
}

int MarkdownParser::textCallback(MD_TEXTTYPE type, const MD_CHAR* text, MD_SIZE size, void* userdata) {
    auto* ctx = static_cast<ParserContext*>(userdata);
    
    switch (type) {
        case MD_TEXT_NORMAL:
        case MD_TEXT_CODE:
        case MD_TEXT_LATEXMATH:
        case MD_TEXT_HTML:
        case MD_TEXT_ENTITY:
            ctx->currentText.append(text, size);
            break;
        case MD_TEXT_SOFTBR: {
            ctx->flushText();
            auto softbreak = std::make_shared<MarkdownNode>("softbreak");
            ctx->currentNode()->children.push_back(softbreak);
            break;
        }
        case MD_TEXT_BR: {
            ctx->flushText();
            auto hardbreak = std::make_shared<MarkdownNode>("hardbreak");
            ctx->currentNode()->children.push_back(hardbreak);
            break;
        }
        case MD_TEXT_NULLCHAR:
            // Skip null characters
            break;
    }
    
    return 0;
}

ParseResult MarkdownParser::parse(const std::string& content, const InternalParserOptions& options) {
    // Check input size limit
    if (content.size() > options.maxInputSize) {
        return ParseResult::Failure("Input exceeds maximum size limit");
    }
    
    // Handle empty content
    if (content.empty()) {
        auto emptyDoc = std::make_shared<MarkdownNode>("document");
        return ParseResult::Success({emptyDoc});
    }
    
    ParserContext ctx;
    
    MD_PARSER parser = {
        0,  // abi_version - use 0 for compatibility
        optionsToFlags(options),
        enterBlockCallback,
        leaveBlockCallback,
        enterSpanCallback,
        leaveSpanCallback,
        textCallback,
        nullptr,  // debug_log
        nullptr   // syntax
    };
    
    int result = md_parse(content.c_str(), static_cast<MD_SIZE>(content.size()), &parser, &ctx);
    
    if (result != 0) {
        return ParseResult::Failure("Failed to parse markdown");
    }
    
    // Flush any remaining text
    ctx.flushText();
    
    return ParseResult::Success({ctx.root});
}

} // namespace margelo::nitro::hypermarkdown
