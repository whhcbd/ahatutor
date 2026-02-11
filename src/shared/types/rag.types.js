"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRole = exports.DocumentStatus = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["PDF"] = "pdf";
    DocumentType["WORD"] = "word";
    DocumentType["MARKDOWN"] = "markdown";
    DocumentType["TEXT"] = "text";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["UPLOADING"] = "uploading";
    DocumentStatus["PARSING"] = "parsing";
    DocumentStatus["VECTORIZING"] = "vectorizing";
    DocumentStatus["READY"] = "ready";
    DocumentStatus["ERROR"] = "error";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var MessageRole;
(function (MessageRole) {
    MessageRole["SYSTEM"] = "system";
    MessageRole["USER"] = "user";
    MessageRole["ASSISTANT"] = "assistant";
})(MessageRole || (exports.MessageRole = MessageRole = {}));
//# sourceMappingURL=rag.types.js.map