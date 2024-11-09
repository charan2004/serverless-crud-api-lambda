"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = require("aws-sdk");
aws_sdk_1.default.config.update({
    region: "eu-north-1"
});
var dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
var dynamoDBTableName = 'UserInfo';
var signupPath = '/signUp';
var loginPath = '/LogIn';
exports.handler = function (event) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Request Event: ', event);
                    _a = true;
                    switch (_a) {
                        case event.httpMethod === 'POST' && event.path === signupPath: return [3 /*break*/, 1];
                        case event.httpMethod === 'POST' && event.path === loginPath: return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, signUp(JSON.parse(event.body))];
                case 2:
                    response = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, LogIn(JSON.parse(event.body))];
                case 4:
                    response = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    response = buildResponse(404, '404 Not Found');
                    _b.label = 6;
                case 6: return [2 /*return*/, response];
            }
        });
    });
};
function signUp(requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var userName, role, name, email, password, validEmail, getParams, data, putParams, body, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userName = requestBody.UserName, role = requestBody.Role, name = requestBody.Name, email = requestBody.Email, password = requestBody.Password;
                    validEmail = isValidEmail(email);
                    if (!validEmail) {
                        return [2 /*return*/, buildResponse(400, { Operation: 'SignUp', Message: 'Invalid Email', Error: 'Invalid email address' })];
                    }
                    getParams = {
                        TableName: dynamoDBTableName,
                        Key: {
                            'UserName': userName,
                            'Role': role
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, dynamoDB.get(getParams).promise()];
                case 2:
                    data = _a.sent();
                    if (!data.Item) return [3 /*break*/, 3];
                    return [2 /*return*/, buildResponse(400, { Operation: 'SignUp', Message: 'Username exists', Error: 'User already exists' })];
                case 3:
                    putParams = {
                        TableName: dynamoDBTableName,
                        Item: {
                            'UserName': userName,
                            'Role': role,
                            'Name': name,
                            'Email': email,
                            'Password': password
                        }
                    };
                    return [4 /*yield*/, dynamoDB.put(putParams).promise()];
                case 4:
                    _a.sent();
                    body = {
                        Operation: 'SignUp',
                        Message: 'Signed in successfully',
                        Item: { 'UserName': userName, 'Role': role, 'Email': email }
                    };
                    return [2 /*return*/, buildResponse(200, body)];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error: ', error_1);
                    return [2 /*return*/, buildResponse(500, { Operation: 'SignUp', Message: 'FAILURE', Error: error_1.toString() })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function LogIn(requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, role, getParams, data, body, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = requestBody.UserName;
                    password = requestBody.Password;
                    role = requestBody.Role;
                    getParams = {
                        TableName: dynamoDBTableName,
                        Key: {
                            'UserName': username,
                            'Role': role
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dynamoDB.get(getParams).promise()];
                case 2:
                    data = _a.sent();
                    if (data.Item) {
                        if (password === data.Item.Password) {
                            body = {
                                Operation: 'LogIn',
                                Message: 'Logged in successfully, Welcome!',
                                Item: { 'UserName': username, 'Role': role, 'Email': requestBody.Email }
                            };
                            return [2 /*return*/, buildResponse(200, body)];
                        }
                        else {
                            return [2 /*return*/, buildResponse(400, { Operation: 'LogIn', Message: 'Invalid Credentials.', Error: 'Invalid Credentials' })];
                        }
                    }
                    else {
                        return [2 /*return*/, buildResponse(400, { Operation: 'LogIn', Message: 'Username does not exists.', Error: 'User does not exist' })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error: ', error_2);
                    return [2 /*return*/, buildResponse(500, { Operation: 'LogIn', Message: 'FAILURE', Error: error_2.toString() })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}
function isValidEmail(email) {
    var atposition = email.indexOf('@');
    var dotposition = email.lastIndexOf('.');
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length) {
        console.error("Invalid Email.");
        return false;
    }
    else {
        return true;
    }
}
