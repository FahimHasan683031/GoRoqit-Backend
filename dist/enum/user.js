"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_STATUS = exports.USER_ROLES = void 0;
var USER_ROLES;
(function (USER_ROLES) {
    USER_ROLES["ADMIN"] = "admin";
    USER_ROLES["APPLICANT"] = "applicant";
    USER_ROLES["RECRUITER"] = "recruiter";
    USER_ROLES["GUEST"] = "guest";
})(USER_ROLES || (exports.USER_ROLES = USER_ROLES = {}));
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["ACTIVE"] = "active";
    USER_STATUS["RESTRICTED"] = "restricted";
    USER_STATUS["DELETED"] = "deleted";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
