"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMProvider = exports.AgentType = void 0;
var AgentType;
(function (AgentType) {
    AgentType["CONCEPT_ANALYZER"] = "concept_analyzer";
    AgentType["PREREQUISITE_EXPLORER"] = "prerequisite_explorer";
    AgentType["GENETICS_ENRICHER"] = "genetics_enricher";
    AgentType["VISUAL_DESIGNER"] = "visual_designer";
    AgentType["NARRATIVE_COMPOSER"] = "narrative_composer";
    AgentType["QUIZ_GENERATOR"] = "quiz_generator";
})(AgentType || (exports.AgentType = AgentType = {}));
var LLMProvider;
(function (LLMProvider) {
    LLMProvider["OPENAI"] = "openai";
    LLMProvider["CLAUDE"] = "claude";
    LLMProvider["DEEPSEEK"] = "deepseek";
    LLMProvider["KIMI"] = "kimi";
})(LLMProvider || (exports.LLMProvider = LLMProvider = {}));
//# sourceMappingURL=agent.types.js.map