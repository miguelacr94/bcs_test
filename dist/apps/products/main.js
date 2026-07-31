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
exports.ProductsModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const controllers_1 = __webpack_require__(5);
const product_schema_1 = __webpack_require__(34);
const mongoose_product_repository_1 = __webpack_require__(36);
const use_cases_1 = __webpack_require__(17);
const envs_1 = __webpack_require__(38);
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(envs_1.envs.mongo.productsUri),
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.ProductDocument.name, schema: product_schema_1.ProductSchema },
            ]),
        ],
        controllers: [controllers_1.ProductsCatalogController, controllers_1.ProductsInventoryController],
        providers: [
            use_cases_1.CreateProductUseCase,
            use_cases_1.GetAllProductsUseCase,
            use_cases_1.GetProductUseCase,
            use_cases_1.UpdateProductUseCase,
            use_cases_1.DeleteProductUseCase,
            use_cases_1.ReduceStockUseCase,
            use_cases_1.GetProductsByCategoryUseCase,
            use_cases_1.ActivateProductUseCase,
            use_cases_1.RestoreStockUseCase,
            {
                provide: 'ProductRepositoryPort',
                useClass: mongoose_product_repository_1.MongooseProductRepository,
            },
        ],
    })
], ProductsModule);


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
__exportStar(__webpack_require__(6), exports);
__exportStar(__webpack_require__(33), exports);


/***/ }),
/* 6 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsCatalogController = void 0;
const common_1 = __webpack_require__(3);
const dtos_1 = __webpack_require__(7);
const enums_1 = __webpack_require__(12);
const microservices_1 = __webpack_require__(16);
const use_cases_1 = __webpack_require__(17);
const dtos_2 = __webpack_require__(30);
let ProductsCatalogController = class ProductsCatalogController {
    createProductUseCase;
    getAllProductsUseCase;
    getProductUseCase;
    updateProductUseCase;
    deleteProductUseCase;
    getProductsByCategoryUseCase;
    activateProductUseCase;
    constructor(createProductUseCase, getAllProductsUseCase, getProductUseCase, updateProductUseCase, deleteProductUseCase, getProductsByCategoryUseCase, activateProductUseCase) {
        this.createProductUseCase = createProductUseCase;
        this.getAllProductsUseCase = getAllProductsUseCase;
        this.getProductUseCase = getProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
        this.getProductsByCategoryUseCase = getProductsByCategoryUseCase;
        this.activateProductUseCase = activateProductUseCase;
    }
    async createProduct(dto) {
        console.log('Microservicio Products (Catálogo): Creando producto:', dto.name);
        try {
            return await this.createProductUseCase.execute(dto);
        }
        catch (error) {
            console.error('Microservicio Products Error (Create):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async getAllProducts(paginationDto) {
        console.log('Microservicio Products (Catálogo): Solicitando todos los productos con paginación...', paginationDto);
        try {
            return await this.getAllProductsUseCase.execute(paginationDto || { page: 1, limit: 10 });
        }
        catch (error) {
            console.error('Microservicio Products Error (FindAll):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async getProductById(data) {
        console.log('Microservicio Products (Catálogo): Buscando producto con ID:', data.id);
        try {
            return await this.getProductUseCase.execute(data.id);
        }
        catch (error) {
            console.error('Microservicio Products Error (FindOne):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async getProductsByCategory(data) {
        console.log('Microservicio Products (Catálogo): Buscando producto por categoria con ID:', data.id);
        try {
            return await this.getProductsByCategoryUseCase.execute(data.id, data.paginationDto);
        }
        catch (error) {
            console.error('Microservicio Products Error (FindByCategory):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async updateProduct(data) {
        console.log('Microservicio Products (Catálogo): Actualizando producto con ID:', data.id);
        try {
            return await this.updateProductUseCase.execute(data.id, data.dto);
        }
        catch (error) {
            console.error('Microservicio Products Error (Update):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async activateProduct(data) {
        console.log('Microservicio Products (Catálogo): Activando producto con ID:', data.id);
        try {
            return await this.activateProductUseCase.execute(data.id);
        }
        catch (error) {
            console.error('Microservicio Products Error (Activate):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async deleteProduct(data) {
        console.log('Microservicio Products (Catálogo): Eliminando producto con ID:', data.id);
        try {
            return await this.deleteProductUseCase.execute(data.id);
        }
        catch (error) {
            console.error('Microservicio Products Error (Delete):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
};
exports.ProductsCatalogController = ProductsCatalogController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.CREATE_PRODUCT }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof dtos_2.CreateProductDto !== "undefined" && dtos_2.CreateProductDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "createProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.GET_ALL_PRODUCTS }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof dtos_1.PaginationDto !== "undefined" && dtos_1.PaginationDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "getAllProducts", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.GET_PRODUCT_BY_ID }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "getProductById", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.GET_PRODUCTS_BY_CATEGORY }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "getProductsByCategory", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.UPDATE_PRODUCT }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "updateProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.ACTIVATE_PRODUCT }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "activateProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.DELETE_PRODUCT }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsCatalogController.prototype, "deleteProduct", null);
exports.ProductsCatalogController = ProductsCatalogController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof use_cases_1.CreateProductUseCase !== "undefined" && use_cases_1.CreateProductUseCase) === "function" ? _a : Object, typeof (_b = typeof use_cases_1.GetAllProductsUseCase !== "undefined" && use_cases_1.GetAllProductsUseCase) === "function" ? _b : Object, typeof (_c = typeof use_cases_1.GetProductUseCase !== "undefined" && use_cases_1.GetProductUseCase) === "function" ? _c : Object, typeof (_d = typeof use_cases_1.UpdateProductUseCase !== "undefined" && use_cases_1.UpdateProductUseCase) === "function" ? _d : Object, typeof (_e = typeof use_cases_1.DeleteProductUseCase !== "undefined" && use_cases_1.DeleteProductUseCase) === "function" ? _e : Object, typeof (_f = typeof use_cases_1.GetProductsByCategoryUseCase !== "undefined" && use_cases_1.GetProductsByCategoryUseCase) === "function" ? _f : Object, typeof (_g = typeof use_cases_1.ActivateProductUseCase !== "undefined" && use_cases_1.ActivateProductUseCase) === "function" ? _g : Object])
], ProductsCatalogController);


/***/ }),
/* 7 */
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
__exportStar(__webpack_require__(8), exports);


/***/ }),
/* 8 */
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
const class_validator_1 = __webpack_require__(9);
const class_transformer_1 = __webpack_require__(10);
const swagger_1 = __webpack_require__(11);
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
/* 9 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

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
__exportStar(__webpack_require__(14), exports);
__exportStar(__webpack_require__(15), exports);


/***/ }),
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(18), exports);
__exportStar(__webpack_require__(22), exports);
__exportStar(__webpack_require__(23), exports);
__exportStar(__webpack_require__(24), exports);
__exportStar(__webpack_require__(25), exports);
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(28), exports);
__exportStar(__webpack_require__(29), exports);


/***/ }),
/* 18 */
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
exports.CreateProductUseCase = void 0;
const common_1 = __webpack_require__(3);
const crypto = __importStar(__webpack_require__(19));
const product_entity_1 = __webpack_require__(20);
let CreateProductUseCase = class CreateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(dto) {
        const secureId = crypto.randomUUID();
        const createdAt = new Date();
        const newProduct = new product_entity_1.Product(secureId, dto.name, dto.description, dto.price, dto.stock, dto.categoryId, dto.isActive, createdAt);
        return await this.productRepository.save(newProduct);
    }
};
exports.CreateProductUseCase = CreateProductUseCase;
exports.CreateProductUseCase = CreateProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], CreateProductUseCase);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Product = void 0;
const domain_exception_1 = __webpack_require__(21);
class Product {
    id;
    name;
    description;
    price;
    stock;
    categoryId;
    isActive;
    createdAt;
    constructor(id, name, description, price, stock, categoryId, isActive, createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.categoryId = categoryId;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.validateName();
        this.validatePrice();
        this.validateStock();
    }
    validateName() {
        if (!this.name || this.name.trim().length === 0) {
            throw new domain_exception_1.DomainException('El nombre del producto no puede estar vacío.');
        }
        if (this.name.length < 3) {
            throw new domain_exception_1.DomainException('El nombre del producto debe tener al menos 3 caracteres.');
        }
    }
    validatePrice() {
        if (this.price < 0) {
            throw new domain_exception_1.DomainException('El precio del producto no puede ser menor a 0.');
        }
    }
    validateStock() {
        if (this.stock < 0) {
            throw new domain_exception_1.DomainException('El inventario (stock) del producto no puede ser negativo.');
        }
    }
    deactivate() {
        this.isActive = false;
    }
    activate() {
        this.isActive = true;
    }
}
exports.Product = Product;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message) {
        super(message);
        this.name = 'DomainException';
    }
}
exports.DomainException = DomainException;


/***/ }),
/* 22 */
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
exports.GetAllProductsUseCase = void 0;
const common_1 = __webpack_require__(3);
let GetAllProductsUseCase = class GetAllProductsUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const { data, total } = await this.productRepository.findAll(paginationDto);
        return {
            data,
            meta: {
                totalItems: total,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
};
exports.GetAllProductsUseCase = GetAllProductsUseCase;
exports.GetAllProductsUseCase = GetAllProductsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], GetAllProductsUseCase);


/***/ }),
/* 23 */
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
exports.GetProductUseCase = void 0;
const common_1 = __webpack_require__(3);
let GetProductUseCase = class GetProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
        }
        return product;
    }
};
exports.GetProductUseCase = GetProductUseCase;
exports.GetProductUseCase = GetProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], GetProductUseCase);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteProductUseCase = void 0;
const common_1 = __webpack_require__(3);
let DeleteProductUseCase = class DeleteProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
        }
        product.deactivate();
        await this.productRepository.save(product);
        return { success: true };
    }
};
exports.DeleteProductUseCase = DeleteProductUseCase;
exports.DeleteProductUseCase = DeleteProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], DeleteProductUseCase);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProductUseCase = void 0;
const common_1 = __webpack_require__(3);
const product_entity_1 = __webpack_require__(20);
let UpdateProductUseCase = class UpdateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id, dto) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado para actualizar.`);
        }
        const updatedProduct = new product_entity_1.Product(product.id, dto.name !== undefined ? dto.name : product.name, dto.description !== undefined ? dto.description : product.description, dto.price !== undefined ? dto.price : product.price, dto.stock !== undefined ? dto.stock : product.stock, dto.categoryId !== undefined ? dto.categoryId : product.categoryId, dto.isActive !== undefined ? dto.isActive : product.isActive, product.createdAt);
        return await this.productRepository.save(updatedProduct);
    }
};
exports.UpdateProductUseCase = UpdateProductUseCase;
exports.UpdateProductUseCase = UpdateProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], UpdateProductUseCase);


/***/ }),
/* 26 */
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
exports.GetProductsByCategoryUseCase = void 0;
const common_1 = __webpack_require__(3);
let GetProductsByCategoryUseCase = class GetProductsByCategoryUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(categoryId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const { data, total } = await this.productRepository.findByCategory(categoryId, paginationDto);
        return {
            data,
            meta: {
                totalItems: total,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
};
exports.GetProductsByCategoryUseCase = GetProductsByCategoryUseCase;
exports.GetProductsByCategoryUseCase = GetProductsByCategoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], GetProductsByCategoryUseCase);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivateProductUseCase = void 0;
const common_1 = __webpack_require__(3);
let ActivateProductUseCase = class ActivateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
        }
        product.activate();
        await this.productRepository.save(product);
        return { success: true };
    }
};
exports.ActivateProductUseCase = ActivateProductUseCase;
exports.ActivateProductUseCase = ActivateProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], ActivateProductUseCase);


/***/ }),
/* 28 */
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
exports.ReduceStockUseCase = void 0;
const common_1 = __webpack_require__(3);
const product_entity_1 = __webpack_require__(20);
let ReduceStockUseCase = class ReduceStockUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(items) {
        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no fue encontrado para descontar inventario.`);
            }
            const newStock = product.stock - item.quantity;
            if (newStock < 0) {
                throw new Error(`Inventario insuficiente para el producto "${product.name}". Stock disponible: ${product.stock}, solicitado: ${item.quantity}`);
            }
            const updatedProduct = new product_entity_1.Product(product.id, product.name, product.description, product.price, newStock, product.categoryId, product.isActive, product.createdAt);
            await this.productRepository.save(updatedProduct);
        }
        return true;
    }
};
exports.ReduceStockUseCase = ReduceStockUseCase;
exports.ReduceStockUseCase = ReduceStockUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], ReduceStockUseCase);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RestoreStockUseCase = void 0;
const common_1 = __webpack_require__(3);
const product_entity_1 = __webpack_require__(20);
let RestoreStockUseCase = class RestoreStockUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(items) {
        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no fue encontrado para restaurar inventario.`);
            }
            const newStock = product.stock + item.quantity;
            const updatedProduct = new product_entity_1.Product(product.id, product.name, product.description, product.price, newStock, product.categoryId, product.isActive, product.createdAt);
            await this.productRepository.save(updatedProduct);
        }
        return true;
    }
};
exports.RestoreStockUseCase = RestoreStockUseCase;
exports.RestoreStockUseCase = RestoreStockUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], RestoreStockUseCase);


/***/ }),
/* 30 */
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
__exportStar(__webpack_require__(31), exports);
__exportStar(__webpack_require__(32), exports);


/***/ }),
/* 31 */
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
const swagger_1 = __webpack_require__(11);
const class_validator_1 = __webpack_require__(9);
class CreateProductDto {
    name;
    description;
    price;
    stock;
    categoryId;
    isActive = true;
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
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del producto',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProductDto = void 0;
const swagger_1 = __webpack_require__(11);
const class_validator_1 = __webpack_require__(9);
class UpdateProductDto {
    name;
    description;
    price;
    stock;
    categoryId;
    id;
    isActive;
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID del producto',
        example: '23434-22423-e4234',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estado del producto',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isActive", void 0);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsInventoryController = void 0;
const common_1 = __webpack_require__(3);
const enums_1 = __webpack_require__(12);
const microservices_1 = __webpack_require__(16);
const use_cases_1 = __webpack_require__(17);
let ProductsInventoryController = class ProductsInventoryController {
    reduceStockUseCase;
    restoreStockUseCase;
    constructor(reduceStockUseCase, restoreStockUseCase) {
        this.reduceStockUseCase = reduceStockUseCase;
        this.restoreStockUseCase = restoreStockUseCase;
    }
    async reduceStock(data) {
        console.log('Microservicio Products (Inventario): Petición de reducción de stock recibida por Redis...');
        try {
            return await this.reduceStockUseCase.execute(data.items);
        }
        catch (error) {
            console.error('Microservicio Products Error (ReduceStock):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async restoreStock(data) {
        console.log('Microservicio Products (Inventario): Petición de restauración de stock recibida por Redis...');
        try {
            return await this.restoreStockUseCase.execute(data.items);
        }
        catch (error) {
            console.error('Microservicio Products Error (RestoreStock):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
};
exports.ProductsInventoryController = ProductsInventoryController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.REDUCE_STOCK }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsInventoryController.prototype, "reduceStock", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.ProductPattern.RESTORE_STOCK }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsInventoryController.prototype, "restoreStock", null);
exports.ProductsInventoryController = ProductsInventoryController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof use_cases_1.ReduceStockUseCase !== "undefined" && use_cases_1.ReduceStockUseCase) === "function" ? _a : Object, typeof (_b = typeof use_cases_1.RestoreStockUseCase !== "undefined" && use_cases_1.RestoreStockUseCase) === "function" ? _b : Object])
], ProductsInventoryController);


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
exports.ProductSchema = exports.ProductDocument = void 0;
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(35);
let ProductDocument = class ProductDocument extends mongoose_2.Document {
    name;
    description;
    price;
    stock;
    categoryId;
    isActive;
    createdAt;
};
exports.ProductDocument = ProductDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductDocument.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductDocument.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ProductDocument.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ProductDocument.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductDocument.prototype, "categoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ProductDocument.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ProductDocument.prototype, "createdAt", void 0);
exports.ProductDocument = ProductDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'products' })
], ProductDocument);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(ProductDocument);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 36 */
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
exports.MongooseProductRepository = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(35);
const product_schema_1 = __webpack_require__(34);
const product_mapper_1 = __webpack_require__(37);
let MongooseProductRepository = class MongooseProductRepository {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async save(product) {
        const persistenceData = product_mapper_1.ProductMapper.toPersistence(product);
        if (product.id && mongoose_2.Types.ObjectId.isValid(product.id)) {
            const updatedDoc = await this.productModel
                .findByIdAndUpdate(product.id, persistenceData, { new: true })
                .exec();
            if (updatedDoc) {
                return product_mapper_1.ProductMapper.toDomain(updatedDoc);
            }
        }
        const createdProduct = new this.productModel(persistenceData);
        const savedDoc = await createdProduct.save();
        return product_mapper_1.ProductMapper.toDomain(savedDoc);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            this.productModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
            this.productModel.countDocuments({ isActive: true }).exec(),
        ]);
        return {
            data: docs.map((doc) => product_mapper_1.ProductMapper.toDomain(doc)),
            total,
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await this.productModel.findById(id).exec();
        if (!doc) {
            return null;
        }
        return product_mapper_1.ProductMapper.toDomain(doc);
    }
    async findByCategory(categoryId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            this.productModel
                .find({ categoryId, isActive: true })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments({ categoryId, isActive: true }).exec(),
        ]);
        return {
            data: docs.map((doc) => product_mapper_1.ProductMapper.toDomain(doc)),
            total,
        };
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return false;
        }
        const doc = await this.productModel.findByIdAndDelete(id).exec();
        return !!doc;
    }
};
exports.MongooseProductRepository = MongooseProductRepository;
exports.MongooseProductRepository = MongooseProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.ProductDocument.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MongooseProductRepository);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductMapper = void 0;
const product_entity_1 = __webpack_require__(20);
class ProductMapper {
    static toDomain(document) {
        return new product_entity_1.Product(document._id.toString(), document.name, document.description, document.price, document.stock, document.categoryId, document.isActive !== undefined ? document.isActive : true, document.createdAt);
    }
    static toPersistence(domain) {
        return {
            name: domain.name,
            description: domain.description,
            price: domain.price,
            stock: domain.stock,
            categoryId: domain.categoryId,
            createdAt: domain.createdAt,
        };
    }
}
exports.ProductMapper = ProductMapper;


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envs = void 0;
__webpack_require__(39);
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
/* 39 */
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
const products_module_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(16);
const envs_1 = __webpack_require__(38);
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(products_module_1.ProductsModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            host: envs_1.envs.redis.host,
            port: 6379,
        },
    });
    await app.listen();
    console.log('Microservicio Products iniciado y escuchando en Redis...');
}
bootstrap();

})();

/******/ })()
;