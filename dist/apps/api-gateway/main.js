/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const auth_module_1 = __webpack_require__(7);
const products_module_1 = __webpack_require__(24);
const orders_module_1 = __webpack_require__(31);
const logger_middleware_1 = __webpack_require__(38);
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(2);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(2);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(8);
const auth_controller_1 = __webpack_require__(9);
const envs_1 = __webpack_require__(22);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'AUTH_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),
/* 9 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const enums_1 = __webpack_require__(10);
const swagger_1 = __webpack_require__(3);
const auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(16);
const roles_decorator_1 = __webpack_require__(17);
const microservices_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(15);
const register_user_dto_1 = __webpack_require__(18);
const login_user_dto_1 = __webpack_require__(20);
const update_user_profile_dto_1 = __webpack_require__(21);
let AuthController = class AuthController {
    authClient;
    constructor(authClient) {
        this.authClient = authClient;
    }
    async registerUser(body) {
        console.log('Gateway: Enviando petición de registro a Auth por Redis...');
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.REGISTER_USER }, body));
        console.log('Gateway: Respuesta de registro recibida del microservicio:', result);
        return result;
    }
    async loginUser(body) {
        console.log('Gateway: Enviando petición de login a Auth por Redis...');
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.LOGIN_USER }, body));
        console.log('Gateway: Respuesta de login recibida del microservicio:', result);
        return result;
    }
    async validateTokenTest(token) {
        console.log('Gateway: Enviando validación de token a Auth por Redis...');
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.VALIDATE_TOKEN }, { token }));
        console.log('Gateway: Respuesta recibida del microservicio Auth:', result);
        return result;
    }
    getProfile(req) {
        console.log('Gateway: Devolviendo perfil del usuario autenticado:', req.user.email);
        return {
            success: true,
            user: req.user,
        };
    }
    async updateProfile(req, body) {
        console.log('Gateway: Enviando petición de actualización de perfil a Auth...');
        const payload = {
            userId: req.user.id,
            ...body,
        };
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.UPDATE_USER_PROFILE }, payload));
        console.log('Gateway: Respuesta de actualización recibida:', result);
        return result;
    }
    async refreshToken(body) {
        console.log('Gateway: Enviando petición de refresco de token a Auth...');
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.REFRESH_TOKEN }, body));
        console.log('Gateway: Respuesta de refresco recibida del microservicio:', result);
        return result;
    }
    async logout(req) {
        console.log('Gateway: Enviando petición de logout para usuario:', req.user.id);
        const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.LOGOUT }, { userId: req.user.id }));
        console.log('Gateway: Respuesta de logout recibida del microservicio:', result);
        return result;
    }
    getAdminDashboard() {
        return {
            success: true,
            message: '¡Bienvenido al panel de administración!',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_user_dto_1.RegisterUserDto !== "undefined" && register_user_dto_1.RegisterUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión (Login)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token generado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Credenciales inválidas o campos vacíos' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_user_dto_1.LoginUserDto !== "undefined" && login_user_dto_1.LoginUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint de prueba para validar tokens manualmente' }),
    (0, common_1.Get)('validate-test'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateTokenTest", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil retornado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token no provisto o expirado' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar perfil del usuario autenticado (Demo DDD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil actualizado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token no provisto o expirado' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof update_user_profile_dto_1.UpdateUserProfileDto !== "undefined" && update_user_profile_dto_1.UpdateUserProfileDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refrescar el token de acceso' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nuevos tokens generados con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Refresh token inválido o expirado' }),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar sesión' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión cerrada con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token no provisto o expirado' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint de prueba solo para administradores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Acceso autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos suficientes' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN),
    (0, common_1.Get)('admin-only'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAdminDashboard", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticación'),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 10 */
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
__exportStar(__webpack_require__(11), exports);
__exportStar(__webpack_require__(12), exports);
__exportStar(__webpack_require__(13), exports);


/***/ }),
/* 11 */
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
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));


/***/ }),
/* 13 */
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
    ProductPattern["GET_PRODUCTS_BY_CATEGORY"] = "get_products_by_category";
})(ProductPattern || (exports.ProductPattern = ProductPattern = {}));
var OrderPattern;
(function (OrderPattern) {
    OrderPattern["CREATE_ORDER"] = "create_order";
    OrderPattern["GET_USER_ORDERS"] = "get_user_orders";
})(OrderPattern || (exports.OrderPattern = OrderPattern = {}));


/***/ }),
/* 14 */
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
exports.AuthGuard = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(15);
const enums_1 = __webpack_require__(10);
let AuthGuard = class AuthGuard {
    authClient;
    constructor(authClient) {
        this.authClient = authClient;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Token no provisto.');
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Formato de token inválido. Debe ser Bearer <token>.');
        }
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: enums_1.AuthPattern.VALIDATE_TOKEN }, { token }));
            if (!result || !result.isValid) {
                throw new common_1.UnauthorizedException(result?.error || 'Token inválido o expirado.');
            }
            request['user'] = result.user;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message || 'Error de autenticación.');
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], AuthGuard);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("rxjs");

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const roles_decorator_1 = __webpack_require__(17);
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.role) {
            throw new common_1.ForbiddenException('No tienes permisos para acceder a este recurso.');
        }
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new common_1.ForbiddenException('No tienes permisos suficientes (rol requerido).');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 18 */
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
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(19);
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
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 20 */
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
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(19);
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
exports.UpdateUserProfileDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(19);
class UpdateUserProfileDto {
    name;
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo nombre del usuario (opcional)',
        example: 'Miguel Acr Actualizado',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "name", void 0);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envs = void 0;
__webpack_require__(23);
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
/* 23 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(8);
const products_controller_1 = __webpack_require__(25);
const envs_1 = __webpack_require__(22);
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'PRODUCTS_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
                {
                    name: 'AUTH_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
            ]),
        ],
        controllers: [products_controller_1.ProductsController],
    })
], ProductsModule);


/***/ }),
/* 25 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsController = void 0;
const common_1 = __webpack_require__(2);
const enums_1 = __webpack_require__(10);
const dtos_1 = __webpack_require__(26);
const swagger_1 = __webpack_require__(3);
const microservices_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(15);
const auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(16);
const roles_decorator_1 = __webpack_require__(17);
const create_product_dto_1 = __webpack_require__(29);
const update_product_dto_1 = __webpack_require__(30);
let ProductsController = class ProductsController {
    productsClient;
    constructor(productsClient) {
        this.productsClient = productsClient;
    }
    async createProduct(body) {
        console.log('Gateway: Enviando petición de creación de producto a Products por Redis...');
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.CREATE_PRODUCT }, body));
    }
    async getAllProducts(paginationDto) {
        console.log('Gateway: Solicitando todos los productos a Products por Redis...');
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.GET_ALL_PRODUCTS }, paginationDto));
    }
    async getProductsByCategory(id, paginationDto) {
        console.log('Gateway: Solicitando todos los productos por categoria a Products por Redis...');
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.GET_PRODUCTS_BY_CATEGORY }, { id, paginationDto }));
    }
    async getProductById(id) {
        console.log('Gateway: Solicitando producto por ID:', id);
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.GET_PRODUCT_BY_ID }, { id }));
    }
    async updateProduct(id, body) {
        console.log('Gateway: Enviando petición de actualización de producto por Redis...');
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.UPDATE_PRODUCT }, { id, dto: body }));
    }
    async deleteProduct(id) {
        console.log('Gateway: Enviando petición de eliminación de producto por Redis...');
        return await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.DELETE_PRODUCT }, { id }));
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado con éxito' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'No tienes permisos suficientes (Solo administradores)',
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_product_dto_1.CreateProductDto !== "undefined" && create_product_dto_1.CreateProductDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener la lista de todos los productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos obtenida' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof dtos_1.PaginationDto !== "undefined" && dtos_1.PaginationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por categoria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos obtenida' }),
    (0, common_1.Get)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof dtos_1.PaginationDto !== "undefined" && dtos_1.PaginationDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductsByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el detalle de un producto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalle del producto retornado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto por ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos suficientes' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_product_dto_1.UpdateProductDto !== "undefined" && update_product_dto_1.UpdateProductDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto por ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto eliminado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos suficientes' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Productos'),
    (0, common_1.Controller)('products'),
    __param(0, (0, common_1.Inject)('PRODUCTS_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], ProductsController);


/***/ }),
/* 26 */
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
__exportStar(__webpack_require__(27), exports);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaginationDto = void 0;
const class_validator_1 = __webpack_require__(19);
const class_transformer_1 = __webpack_require__(28);
const swagger_1 = __webpack_require__(3);
class PaginationDto {
    page = 1;
    limit = 10;
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Página actual', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad de elementos por página', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("class-transformer");

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProductDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(19);
class CreateProductDto {
    name;
    description;
    price;
    stock;
    categoryId;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del producto',
        example: 'Laptop Gamer ASUS ROG',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del producto es obligatorio.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del producto',
        example: 'Laptop ASUS ROG con pantalla 144Hz, Ryzen 7, 16GB RAM, 512GB SSD y RTX 4060.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción del producto es obligatoria.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio unitario del producto',
        example: 1299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser menor a 0.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad disponible en inventario (stock)',
        example: 15,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser menor a 0.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoria del producto',
        example: 'Laptops',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La categoria del producto es obligatoria.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);


/***/ }),
/* 30 */
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
exports.UpdateProductDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(19);
class UpdateProductDto {
    name;
    description;
    price;
    stock;
    categoryId;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nombre del producto',
        example: 'Laptop Gamer ASUS ROG Z',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción del producto',
        example: 'Edición especial ASUS ROG...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Precio unitario del producto',
        example: 1399.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser menor a 0.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cantidad disponible en inventario (stock)',
        example: 20,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser menor a 0.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Categoria del producto',
        example: 'Laptops',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(8);
const orders_controller_1 = __webpack_require__(32);
const envs_1 = __webpack_require__(22);
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'ORDERS_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
                {
                    name: 'PRODUCTS_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
                {
                    name: 'AUTH_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
    })
], OrdersModule);


/***/ }),
/* 32 */
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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersController = void 0;
const common_1 = __webpack_require__(2);
const enums_1 = __webpack_require__(10);
const dtos_1 = __webpack_require__(26);
const swagger_1 = __webpack_require__(3);
const microservices_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(15);
const auth_guard_1 = __webpack_require__(14);
const create_order_dto_1 = __webpack_require__(33);
const interfaces_1 = __webpack_require__(34);
let OrdersController = class OrdersController {
    ordersClient;
    productsClient;
    constructor(ordersClient, productsClient) {
        this.ordersClient = ordersClient;
        this.productsClient = productsClient;
    }
    async createOrder(req, body) {
        const userId = req.user.id;
        console.log('Gateway: Enviando petición de creación de orden para el usuario:', userId);
        return await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: enums_1.OrderPattern.CREATE_ORDER }, { userId, dto: body }));
    }
    async getMyOrders(req, paginationDto) {
        const userId = req.user.id;
        console.log('Gateway: Solicitando historial de órdenes para el usuario:', userId, 'con paginación:', paginationDto);
        return await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: enums_1.OrderPattern.GET_USER_ORDERS }, { userId, paginationDto }));
    }
    async getMyOrdersDetails(req, paginationDto) {
        const userId = req.user.id;
        console.log('Gateway (Composer): Orquestando datos para el usuario:', userId, 'con paginación:', paginationDto);
        const orders = await (0, rxjs_1.firstValueFrom)(this.ordersClient.send({ cmd: enums_1.OrderPattern.GET_USER_ORDERS }, { userId, paginationDto }));
        if (!orders || orders.length === 0) {
            return [];
        }
        const productIdsSet = new Set();
        orders.forEach((order) => {
            order.items.forEach((item) => productIdsSet.add(item.productId));
        });
        const uniqueProductIds = Array.from(productIdsSet);
        const productsDetailsPromises = uniqueProductIds.map(id => (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.GET_PRODUCT_BY_ID }, { id })).catch(err => {
            console.error(`Error obteniendo producto ${id}:`, err);
            return null;
        }));
        const productsArray = await Promise.all(productsDetailsPromises);
        const productsMap = new Map();
        productsArray.forEach(p => {
            if (p && p.id) {
                productsMap.set(p.id, p);
            }
        });
        const composedOrders = orders.map((order) => ({
            orderId: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map((item) => {
                const productDetail = productsMap.get(item.productId);
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: item.price,
                    productName: productDetail ? productDetail.name : 'Producto Desconocido',
                    productDescription: productDetail ? productDetail.description : '',
                };
            })
        }));
        return composedOrders;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva orden de compra' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orden creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (Token no provisto o vencido)' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof interfaces_1.AuthenticatedRequest !== "undefined" && interfaces_1.AuthenticatedRequest) === "function" ? _c : Object, typeof (_d = typeof create_order_dto_1.CreateOrderDto !== "undefined" && create_order_dto_1.CreateOrderDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el historial de órdenes del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial de órdenes obtenido' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, common_1.Get)('my-orders'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof interfaces_1.AuthenticatedRequest !== "undefined" && interfaces_1.AuthenticatedRequest) === "function" ? _e : Object, typeof (_f = typeof dtos_1.PaginationDto !== "undefined" && dtos_1.PaginationDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'API Composer: Obtener órdenes con el detalle completo de cada producto (Paginado)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Órdenes y productos obtenidos exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, common_1.Get)('my-orders-details'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof interfaces_1.AuthenticatedRequest !== "undefined" && interfaces_1.AuthenticatedRequest) === "function" ? _g : Object, typeof (_h = typeof dtos_1.PaginationDto !== "undefined" && dtos_1.PaginationDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrdersDetails", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Órdenes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('orders'),
    __param(0, (0, common_1.Inject)('ORDERS_SERVICE')),
    __param(1, (0, common_1.Inject)('PRODUCTS_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _b : Object])
], OrdersController);


/***/ }),
/* 33 */
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
exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_transformer_1 = __webpack_require__(28);
const class_validator_1 = __webpack_require__(19);
class CreateOrderItemDto {
    productId;
    quantity;
    price;
}
exports.CreateOrderItemDto = CreateOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto a comprar',
        example: '64b2a123...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del producto es obligatorio.' }),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad de unidades a comprar',
        example: 2,
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'La cantidad debe ser de al menos 1 unidad.' }),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio unitario del producto',
        example: 1299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser negativo.' }),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "price", void 0);
class CreateOrderDto {
    items;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de ítems incluidos en la orden de compra',
        type: [CreateOrderItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'La orden debe contener al menos un producto.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);


/***/ }),
/* 34 */
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
__exportStar(__webpack_require__(35), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerMiddleware = void 0;
const common_1 = __webpack_require__(2);
let LoggerMiddleware = class LoggerMiddleware {
    use(req, res, next) {
        const { method, originalUrl } = req;
        const userAgent = req.get('user-agent') || 'Desconocido';
        console.log(`\n[MIDDLEWARE] 🌐 Petición Entrante: ${method} ${originalUrl} - Agente: ${userAgent}`);
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PerformanceInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(40);
let PerformanceInterceptor = class PerformanceInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const methodName = context.getHandler().name;
        const className = context.getClass().name;
        const now = Date.now();
        return next
            .handle()
            .pipe((0, operators_1.tap)(() => {
            const executionTime = Date.now() - now;
            console.log(`[INTERCEPTOR] ⏱️ Ejecución de ${className}.${methodName}() tomó: ${executionTime}ms`);
        }));
    }
};
exports.PerformanceInterceptor = PerformanceInterceptor;
exports.PerformanceInterceptor = PerformanceInterceptor = __decorate([
    (0, common_1.Injectable)()
], PerformanceInterceptor);


/***/ }),
/* 40 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(2);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || 'Error interno del servidor';
        if (exception.getStatus && typeof exception.getStatus === 'function') {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'object' ? res.message : res;
        }
        else if (exception.error) {
            message = exception.error;
            if (message.includes('registrado') || message.includes('existe')) {
                status = common_1.HttpStatus.CONFLICT;
            }
            else if (message.includes('inválidas') || message.includes('incorrecto') || message.includes('expirado')) {
                status = common_1.HttpStatus.UNAUTHORIZED;
            }
            else {
                status = common_1.HttpStatus.BAD_REQUEST;
            }
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: Array.isArray(message) ? message : [message],
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeoutInterceptor = void 0;
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(15);
const operators_1 = __webpack_require__(40);
let TimeoutInterceptor = class TimeoutInterceptor {
    intercept(context, next) {
        const TIMEOUT_MS = 3000;
        const RETRIES = 1;
        return next.handle().pipe((0, operators_1.retry)(RETRIES), (0, operators_1.timeout)(TIMEOUT_MS), (0, operators_1.catchError)((err) => {
            if (err instanceof rxjs_1.TimeoutError) {
                throw new common_1.RequestTimeoutException('El microservicio tardó demasiado en responder. Inténtalo más tarde.');
            }
            throw err;
        }));
    }
};
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.TimeoutInterceptor = TimeoutInterceptor = __decorate([
    (0, common_1.Injectable)()
], TimeoutInterceptor);


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
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const performance_interceptor_1 = __webpack_require__(39);
const all_exceptions_filter_1 = __webpack_require__(41);
const timeout_interceptor_1 = __webpack_require__(42);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        stopAtFirstError: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new performance_interceptor_1.PerformanceInterceptor(), new timeout_interceptor_1.TimeoutInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Store Monorepo API')
        .setDescription('Documentación interactiva de las APIs del API Gateway y microservicios')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT obtenido del login',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

})();

/******/ })()
;