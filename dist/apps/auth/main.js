/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const auth_controller_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(10);
const user_schema_1 = __webpack_require__(27);
const mongoose_user_repository_1 = __webpack_require__(29);
const bcrypt_hasher_adapter_1 = __webpack_require__(31);
const jwt_1 = __webpack_require__(33);
const jwt_token_adapter_1 = __webpack_require__(34);
const use_cases_1 = __webpack_require__(12);
const envs_1 = __webpack_require__(35);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(envs_1.envs.mongo.authUri),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.UserDocument.name, schema: user_schema_1.UserSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: envs_1.envs.jwt.secret,
                signOptions: { expiresIn: envs_1.envs.jwt.expiresIn },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            use_cases_1.RegisterUserUseCase,
            use_cases_1.LoginUserUseCase,
            use_cases_1.RefreshTokenUseCase,
            use_cases_1.LogoutUseCase,
            use_cases_1.UpdateUserUseCase,
            {
                provide: 'UserRepositoryPort',
                useClass: mongoose_user_repository_1.MongooseUserRepository,
            },
            {
                provide: 'PasswordHasherPort',
                useClass: bcrypt_hasher_adapter_1.BcryptHasherAdapter,
            },
            {
                provide: 'TokenServicePort',
                useClass: jwt_token_adapter_1.JwtTokenAdapter,
            },
        ],
    })
], AuthModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const enums_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(10);
const microservices_1 = __webpack_require__(11);
const use_cases_1 = __webpack_require__(12);
const dtos_1 = __webpack_require__(20);
let AuthController = AuthController_1 = class AuthController {
    authService;
    registerUserUseCase;
    loginUserUseCase;
    refreshTokenUseCase;
    logoutUseCase;
    updateUserUseCase;
    tokenService;
    userRepository;
    constructor(authService, registerUserUseCase, loginUserUseCase, refreshTokenUseCase, logoutUseCase, updateUserUseCase, tokenService, userRepository) {
        this.authService = authService;
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.logoutUseCase = logoutUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }
    logger = new common_1.Logger(AuthController_1.name);
    async registerUser(dto) {
        this.logger.log(`Microservicio Auth: Procesando registro para el correo: ${dto.email}`);
        try {
            const user = await this.registerUserUseCase.execute(dto);
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            };
        }
        catch (error) {
            this.logger.error(`Microservicio Auth Error: ${error.message}`);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async loginUser(dto) {
        this.logger.log(`Microservicio Auth: Procesando inicio de sesión para el correo: ${dto.email}`);
        try {
            return await this.loginUserUseCase.execute(dto);
        }
        catch (error) {
            this.logger.error(`Microservicio Auth Login Error: ${error.message}`);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async validateToken(data) {
        this.logger.log(`Recibida petición de validación de token: ${data.token}`);
        try {
            const decoded = await this.tokenService.verifyToken(data.token);
            const userId = decoded.sub;
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return { isValid: false, error: 'Usuario no encontrado.' };
            }
            return {
                isValid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error al validar token: ${error.message}`);
            return {
                isValid: false,
                error: 'Token inválido o expirado.',
            };
        }
    }
    async refreshToken(data) {
        this.logger.log('Microservicio Auth: Refrescando token...');
        try {
            return await this.refreshTokenUseCase.execute(data.refreshToken);
        }
        catch (error) {
            this.logger.error(`Microservicio Auth Refresh Error: ${error.message}`);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async logout(data) {
        this.logger.log(`Microservicio Auth: Cerrando sesión para usuario: ${data.userId}`);
        try {
            return await this.logoutUseCase.execute(data.userId);
        }
        catch (error) {
            this.logger.error(`Microservicio Auth Logout Error: ${error.message}`);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async updateUserProfile(dto) {
        this.logger.log(`Microservicio Auth: Actualizando perfil para el usuario: ${dto.userId}`);
        try {
            return await this.updateUserUseCase.execute(dto);
        }
        catch (error) {
            this.logger.error(`Microservicio Auth Update Profile Error: ${error.message}`);
            throw new microservices_1.RpcException(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.REGISTER_USER }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof dtos_1.RegisterUserDto !== "undefined" && dtos_1.RegisterUserDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.LOGIN_USER }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof dtos_1.LoginUserDto !== "undefined" && dtos_1.LoginUserDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.VALIDATE_TOKEN }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.REFRESH_TOKEN }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.LOGOUT }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.AuthPattern.UPDATE_USER_PROFILE }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof dtos_1.UpdateUserDto !== "undefined" && dtos_1.UpdateUserDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserProfile", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)(),
    __param(6, (0, common_1.Inject)('TokenServicePort')),
    __param(7, (0, common_1.Inject)('UserRepositoryPort')),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof use_cases_1.RegisterUserUseCase !== "undefined" && use_cases_1.RegisterUserUseCase) === "function" ? _b : Object, typeof (_c = typeof use_cases_1.LoginUserUseCase !== "undefined" && use_cases_1.LoginUserUseCase) === "function" ? _c : Object, typeof (_d = typeof use_cases_1.RefreshTokenUseCase !== "undefined" && use_cases_1.RefreshTokenUseCase) === "function" ? _d : Object, typeof (_e = typeof use_cases_1.LogoutUseCase !== "undefined" && use_cases_1.LogoutUseCase) === "function" ? _e : Object, typeof (_f = typeof use_cases_1.UpdateUserUseCase !== "undefined" && use_cases_1.UpdateUserUseCase) === "function" ? _f : Object, Object, Object])
], AuthController);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7), exports);
__exportStar(__webpack_require__(8), exports);
__exportStar(__webpack_require__(9), exports);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPERADMIN"] = "SUPERADMIN";
})(Role || (exports.Role = Role = {}));


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["COMPLETED"] = "COMPLETED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderPattern = exports.ProductPattern = exports.AuthPattern = void 0;
var AuthPattern;
(function (AuthPattern) {
    AuthPattern["REGISTER_USER"] = "register_user";
    AuthPattern["LOGIN_USER"] = "login_user";
    AuthPattern["VALIDATE_TOKEN"] = "validate_token";
    AuthPattern["REFRESH_TOKEN"] = "refresh_token";
    AuthPattern["LOGOUT"] = "logout";
    AuthPattern["UPDATE_USER_PROFILE"] = "update_user_profile";
})(AuthPattern || (exports.AuthPattern = AuthPattern = {}));
var ProductPattern;
(function (ProductPattern) {
    ProductPattern["CREATE_PRODUCT"] = "create_product";
    ProductPattern["GET_ALL_PRODUCTS"] = "get_all_products";
    ProductPattern["GET_PRODUCT_BY_ID"] = "get_product_by_id";
    ProductPattern["UPDATE_PRODUCT"] = "update_product";
    ProductPattern["DELETE_PRODUCT"] = "delete_product";
    ProductPattern["REDUCE_STOCK"] = "reduce_stock";
    ProductPattern["RESTORE_STOCK"] = "restore_stock";
    ProductPattern["GET_PRODUCTS_BY_CATEGORY"] = "get_products_by_category";
    ProductPattern["ACTIVATE_PRODUCT"] = "activate_product";
})(ProductPattern || (exports.ProductPattern = ProductPattern = {}));
var OrderPattern;
(function (OrderPattern) {
    OrderPattern["CREATE_ORDER"] = "create_order";
    OrderPattern["GET_USER_ORDERS"] = "get_user_orders";
    OrderPattern["CANCEL_ORDER"] = "cancel_order";
    OrderPattern["GET_ORDER_BY_ID"] = "get_order_by_id";
})(OrderPattern || (exports.OrderPattern = OrderPattern = {}));


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
let AuthService = class AuthService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(13), exports);
__exportStar(__webpack_require__(15), exports);
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(17), exports);
__exportStar(__webpack_require__(19), exports);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_entity_1 = __webpack_require__(14);
let LoginUserUseCase = class LoginUserUseCase {
    userRepository;
    passwordHasher;
    tokenService;
    constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }
    async execute(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Credenciales inválidas.');
        }
        const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = await this.tokenService.generateToken(payload, { expiresIn: '1h' });
        const refreshToken = await this.tokenService.generateToken(payload, { expiresIn: '7d' });
        const updatedUser = new user_entity_1.User(user.id, user.name, user.email, user.password, user.role, user.createdAt, refreshToken);
        await this.userRepository.save(updatedUser);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __param(1, (0, common_1.Inject)('PasswordHasherPort')),
    __param(2, (0, common_1.Inject)('TokenServicePort')),
    __metadata("design:paramtypes", [Object, Object, Object])
], LoginUserUseCase);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
class User {
    id;
    name;
    email;
    password;
    role;
    createdAt;
    refreshToken;
    constructor(id, name, email, password, role, createdAt, refreshToken) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        this.refreshToken = refreshToken;
        this.validateEmail();
        this.validatePassword();
    }
    validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error('El correo electrónico provisto no tiene un formato válido.');
        }
    }
    validatePassword() {
        if (!this.password || this.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
    }
}
exports.User = User;


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogoutUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_entity_1 = __webpack_require__(14);
const microservices_1 = __webpack_require__(11);
let LogoutUseCase = class LogoutUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            const updatedUser = new user_entity_1.User(user.id, user.name, user.email, user.password, user.role, user.createdAt, null);
            await this.userRepository.save(updatedUser);
            return { success: true };
        }
        catch (error) {
            throw new microservices_1.RpcException(error.message || 'Error al cerrar sesión.');
        }
    }
};
exports.LogoutUseCase = LogoutUseCase;
exports.LogoutUseCase = LogoutUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], LogoutUseCase);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_entity_1 = __webpack_require__(14);
const microservices_1 = __webpack_require__(11);
let RefreshTokenUseCase = class RefreshTokenUseCase {
    userRepository;
    tokenService;
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async execute(refreshToken) {
        try {
            const decoded = await this.tokenService.verifyToken(refreshToken);
            const userId = decoded.sub;
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            if (!user.refreshToken || user.refreshToken !== refreshToken) {
                throw new Error('Refresh token inválido o revocado.');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const newAccessToken = await this.tokenService.generateToken(payload, { expiresIn: '1h' });
            const newRefreshToken = await this.tokenService.generateToken(payload, { expiresIn: '7d' });
            const updatedUser = new user_entity_1.User(user.id, user.name, user.email, user.password, user.role, user.createdAt, newRefreshToken);
            await this.userRepository.save(updatedUser);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new microservices_1.RpcException(error.message || 'Refresh token inválido.');
        }
    }
};
exports.RefreshTokenUseCase = RefreshTokenUseCase;
exports.RefreshTokenUseCase = RefreshTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __param(1, (0, common_1.Inject)('TokenServicePort')),
    __metadata("design:paramtypes", [Object, Object])
], RefreshTokenUseCase);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterUserUseCase = void 0;
const common_1 = __webpack_require__(3);
const crypto = __importStar(__webpack_require__(18));
const user_entity_1 = __webpack_require__(14);
let RegisterUserUseCase = class RegisterUserUseCase {
    userRepository;
    passwordHasher;
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(dto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error('El correo electrónico ya se encuentra registrado.');
        }
        const hashedPassword = await this.passwordHasher.hash(dto.password);
        const secureId = crypto.randomUUID();
        const createdAt = new Date();
        const newUser = new user_entity_1.User(secureId, dto.name, dto.email, hashedPassword, 'USER', createdAt);
        return this.userRepository.save(newUser);
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __param(1, (0, common_1.Inject)('PasswordHasherPort')),
    __metadata("design:paramtypes", [Object, Object])
], RegisterUserUseCase);


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_entity_1 = __webpack_require__(14);
let UpdateUserUseCase = class UpdateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(dto) {
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        const newName = dto.name !== undefined ? dto.name : user.name;
        const updatedUser = new user_entity_1.User(user.id, newName, user.email, user.password, user.role, user.createdAt, user.refreshToken);
        const savedUser = await this.userRepository.save(updatedUser);
        return {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            createdAt: savedUser.createdAt,
        };
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], UpdateUserUseCase);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(21), exports);
__exportStar(__webpack_require__(24), exports);
__exportStar(__webpack_require__(26), exports);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(23);
class LoginUserDto {
    email;
    password;
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Correo electrónico del usuario registrado',
        example: 'miguel@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico provisto no tiene un formato válido.' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario',
        example: 'mc12345678',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria.' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterUserDto = void 0;
const is_strong_password_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(23);
class RegisterUserDto {
    name;
    email;
    password;
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del usuario',
        example: 'Miguel Contreras',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Correo electrónico único del usuario',
        example: 'miguel@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico provisto no tiene un formato válido.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
        example: 'password123',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, is_strong_password_validator_1.IsStrongPassword)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsStrongPasswordConstraint = void 0;
exports.IsStrongPassword = IsStrongPassword;
const class_validator_1 = __webpack_require__(23);
let IsStrongPasswordConstraint = class IsStrongPasswordConstraint {
    validate(password, args) {
        if (!password)
            return false;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        return regex.test(password);
    }
    defaultMessage(args) {
        return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.';
    }
};
exports.IsStrongPasswordConstraint = IsStrongPasswordConstraint;
exports.IsStrongPasswordConstraint = IsStrongPasswordConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsStrongPasswordConstraint);
function IsStrongPassword(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsStrongPasswordConstraint,
        });
    };
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
class UpdateUserDto {
    userId;
    name;
}
exports.UpdateUserDto = UpdateUserDto;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.UserDocument = void 0;
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(28);
let UserDocument = class UserDocument extends mongoose_2.Document {
    name;
    email;
    password;
    role;
    createdAt;
    refreshToken;
};
exports.UserDocument = UserDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'USER' }),
    __metadata("design:type", String)
], UserDocument.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UserDocument.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], UserDocument.prototype, "refreshToken", void 0);
exports.UserDocument = UserDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'users' })
], UserDocument);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserDocument);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongooseUserRepository = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(28);
const user_schema_1 = __webpack_require__(27);
const user_mapper_1 = __webpack_require__(30);
let MongooseUserRepository = class MongooseUserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async save(user) {
        const persistenceData = user_mapper_1.UserMapper.toPersistence(user);
        if (user.id && mongoose_2.Types.ObjectId.isValid(user.id)) {
            const updatedDoc = await this.userModel.findByIdAndUpdate(user.id, persistenceData, { new: true }).exec();
            if (updatedDoc) {
                return user_mapper_1.UserMapper.toDomain(updatedDoc);
            }
        }
        const createdUser = new this.userModel(persistenceData);
        const savedDoc = await createdUser.save();
        return user_mapper_1.UserMapper.toDomain(savedDoc);
    }
    async findByEmail(email) {
        const doc = await this.userModel.findOne({ email }).exec();
        if (!doc) {
            return null;
        }
        return user_mapper_1.UserMapper.toDomain(doc);
    }
    async findById(id) {
        const doc = await this.userModel.findById(id).exec();
        if (!doc) {
            return null;
        }
        return user_mapper_1.UserMapper.toDomain(doc);
    }
};
exports.MongooseUserRepository = MongooseUserRepository;
exports.MongooseUserRepository = MongooseUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserDocument.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MongooseUserRepository);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserMapper = void 0;
const user_entity_1 = __webpack_require__(14);
class UserMapper {
    static toDomain(document) {
        return new user_entity_1.User(document._id.toString(), document.name, document.email, document.password, document.role, document.createdAt, document.refreshToken);
    }
    static toPersistence(domain) {
        return {
            name: domain.name,
            email: domain.email,
            password: domain.password,
            role: domain.role,
            createdAt: domain.createdAt,
            refreshToken: domain.refreshToken,
        };
    }
}
exports.UserMapper = UserMapper;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BcryptHasherAdapter = void 0;
const common_1 = __webpack_require__(3);
const bcrypt = __importStar(__webpack_require__(32));
let BcryptHasherAdapter = class BcryptHasherAdapter {
    saltRounds = 10;
    async hash(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
};
exports.BcryptHasherAdapter = BcryptHasherAdapter;
exports.BcryptHasherAdapter = BcryptHasherAdapter = __decorate([
    (0, common_1.Injectable)()
], BcryptHasherAdapter);


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtTokenAdapter = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(33);
let JwtTokenAdapter = class JwtTokenAdapter {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateToken(payload, options) {
        return this.jwtService.signAsync(payload, options);
    }
    async verifyToken(token) {
        return this.jwtService.verifyAsync(token);
    }
};
exports.JwtTokenAdapter = JwtTokenAdapter;
exports.JwtTokenAdapter = JwtTokenAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtTokenAdapter);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envs = void 0;
__webpack_require__(36);
exports.envs = {
    mongo: {
        authUri: process.env.MONGO_URI || 'mongodb://localhost:27017/store_auth',
        productsUri: process.env.MONGO_URI || 'mongodb://localhost:27017/store_products',
        ordersUri: process.env.MONGO_URI || 'mongodb://localhost:27017/store_orders',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'mi-clave-secreta-super-dificil-1234',
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h'),
    }
};


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const auth_module_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(11);
const envs_1 = __webpack_require__(35);
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            host: envs_1.envs.redis.host,
            port: 6379,
        },
    });
    await app.listen();
    console.log('Microservicio Auth iniciado y escuchando en Redis...');
}
bootstrap();

})();

/******/ })()
;