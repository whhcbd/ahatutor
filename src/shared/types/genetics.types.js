"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportType = exports.SpeedModeState = exports.ErrorType = exports.Difficulty = exports.QuestionType = void 0;
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["FILL_BLANK"] = "fill_blank";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["ESSAY"] = "essay";
    QuestionType["CALCULATION"] = "calculation";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "easy";
    Difficulty["MEDIUM"] = "medium";
    Difficulty["HARD"] = "hard";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["LOW_LEVEL"] = "low_level";
    ErrorType["HIGH_LEVEL"] = "high_level";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
var SpeedModeState;
(function (SpeedModeState) {
    SpeedModeState["IDLE"] = "idle";
    SpeedModeState["QUESTIONING"] = "questioning";
    SpeedModeState["ANSWERING"] = "answering";
    SpeedModeState["EVALUATING"] = "evaluating";
    SpeedModeState["SELF_ASSESS"] = "self_assess";
    SpeedModeState["EXPLAINING"] = "explaining";
    SpeedModeState["CONTINUING"] = "continuing";
})(SpeedModeState || (exports.SpeedModeState = SpeedModeState = {}));
var ReportType;
(function (ReportType) {
    ReportType["DAILY"] = "daily";
    ReportType["WEEKLY"] = "weekly";
    ReportType["SUBJECT"] = "subject";
    ReportType["MISTAKE"] = "mistake";
})(ReportType || (exports.ReportType = ReportType = {}));
//# sourceMappingURL=genetics.types.js.map