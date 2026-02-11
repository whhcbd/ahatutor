"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBBINGHAUS_INTERVALS = exports.NodeStatus = exports.KnowledgeNodeType = void 0;
var KnowledgeNodeType;
(function (KnowledgeNodeType) {
    KnowledgeNodeType["CONCEPT"] = "concept";
    KnowledgeNodeType["PRINCIPLE"] = "principle";
    KnowledgeNodeType["FORMULA"] = "formula";
    KnowledgeNodeType["EXAMPLE"] = "example";
    KnowledgeNodeType["MISCONCEPTION"] = "misconception";
})(KnowledgeNodeType || (exports.KnowledgeNodeType = KnowledgeNodeType = {}));
var NodeStatus;
(function (NodeStatus) {
    NodeStatus["NOT_STARTED"] = "not_started";
    NodeStatus["IN_PROGRESS"] = "in_progress";
    NodeStatus["MASTERED"] = "mastered";
    NodeStatus["REVIEW_NEEDED"] = "review_needed";
})(NodeStatus || (exports.NodeStatus = NodeStatus = {}));
exports.EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30, 60, 120];
//# sourceMappingURL=knowledge-tree.types.js.map