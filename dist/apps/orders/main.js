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
exports.OrdersModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const microservices_1 = __webpack_require__(5);
const orders_controller_1 = __webpack_require__(6);
const order_schema_1 = __webpack_require__(16);
const mongoose_order_repository_1 = __webpack_require__(18);
const redis_product_service_adapter_1 = __webpack_require__(20);
const use_cases_1 = __webpack_require__(11);
const envs_1 = __webpack_require__(22);
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(envs_1.envs.mongo.ordersUri),
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.OrderDocument.name, schema: order_schema_1.OrderSchema },
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'PRODUCTS_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: envs_1.envs.redis.host,
                        port: 6379,
                    },
                },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [
            use_cases_1.CreateOrderUseCase,
            use_cases_1.GetUserOrdersUseCase,
            {
                provide: 'OrderRepositoryPort',
                useClass: mongoose_order_repository_1.MongooseOrderRepository,
            },
            {
                provide: 'ProductServicePort',
                useClass: redis_product_service_adapter_1.RedisProductServiceAdapter,
            },
        ],
    })
], OrdersModule);


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
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersController = void 0;
const common_1 = __webpack_require__(3);
const enums_1 = __webpack_require__(7);
const microservices_1 = __webpack_require__(5);
const use_cases_1 = __webpack_require__(11);
let OrdersController = class OrdersController {
    createOrderUseCase;
    getUserOrdersUseCase;
    constructor(createOrderUseCase, getUserOrdersUseCase) {
        this.createOrderUseCase = createOrderUseCase;
        this.getUserOrdersUseCase = getUserOrdersUseCase;
    }
    async createOrder(data) {
        console.log('Microservicio Orders: Creando orden para usuario:', data.userId);
        try {
            return await this.createOrderUseCase.execute(data.userId, data.dto);
        }
        catch (error) {
            console.error('Microservicio Orders Error:', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
    async getUserOrders(data) {
        console.log('Microservicio Orders: Consultando órdenes del usuario:', data.userId);
        try {
            return await this.getUserOrdersUseCase.execute(data.userId, data.paginationDto || { page: 1, limit: 10 });
        }
        catch (error) {
            console.error('Microservicio Orders Error (GetUserOrders):', error.message);
            throw new microservices_1.RpcException(error.message);
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.OrderPattern.CREATE_ORDER }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: enums_1.OrderPattern.GET_USER_ORDERS }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getUserOrders", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof use_cases_1.CreateOrderUseCase !== "undefined" && use_cases_1.CreateOrderUseCase) === "function" ? _a : Object, typeof (_b = typeof use_cases_1.GetUserOrdersUseCase !== "undefined" && use_cases_1.GetUserOrdersUseCase) === "function" ? _b : Object])
], OrdersController);


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
__exportStar(__webpack_require__(9), exports);
__exportStar(__webpack_require__(10), exports);


/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
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
})(ProductPattern || (exports.ProductPattern = ProductPattern = {}));
var OrderPattern;
(function (OrderPattern) {
    OrderPattern["CREATE_ORDER"] = "create_order";
    OrderPattern["GET_USER_ORDERS"] = "get_user_orders";
})(OrderPattern || (exports.OrderPattern = OrderPattern = {}));


/***/ }),
/* 11 */
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
__exportStar(__webpack_require__(12), exports);
__exportStar(__webpack_require__(15), exports);


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
exports.CreateOrderUseCase = void 0;
const common_1 = __webpack_require__(3);
const crypto = __importStar(__webpack_require__(13));
const order_entity_1 = __webpack_require__(14);
const enums_1 = __webpack_require__(7);
let CreateOrderUseCase = class CreateOrderUseCase {
    orderRepository;
    productService;
    constructor(orderRepository, productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }
    async execute(userId, dto) {
        const secureId = crypto.randomUUID();
        const createdAt = new Date();
        const totalAmount = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const domainItems = dto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        const newOrder = new order_entity_1.Order(secureId, userId, domainItems, totalAmount, enums_1.OrderStatus.PENDING, createdAt);
        const stockReduced = await this.productService.reduceStock(dto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
        })));
        if (!stockReduced) {
            throw new Error('No se pudo reducir el inventario para procesar la orden.');
        }
        return await this.orderRepository.save(newOrder);
    }
};
exports.CreateOrderUseCase = CreateOrderUseCase;
exports.CreateOrderUseCase = CreateOrderUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('OrderRepositoryPort')),
    __param(1, (0, common_1.Inject)('ProductServicePort')),
    __metadata("design:paramtypes", [Object, Object])
], CreateOrderUseCase);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Order = void 0;
class Order {
    id;
    userId;
    items;
    totalAmount;
    status;
    createdAt;
    constructor(id, userId, items, totalAmount, status, createdAt) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.validateItems();
        this.validateTotalAmount();
    }
    validateItems() {
        if (!this.items || this.items.length === 0) {
            throw new Error('Una orden de compra debe contener al menos un producto.');
        }
    }
    validateTotalAmount() {
        if (this.totalAmount <= 0) {
            throw new Error('El monto total de la orden debe ser mayor a 0.');
        }
    }
}
exports.Order = Order;


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
exports.GetUserOrdersUseCase = void 0;
const common_1 = __webpack_require__(3);
let GetUserOrdersUseCase = class GetUserOrdersUseCase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(userId, paginationDto) {
        return await this.orderRepository.findByUserId(userId, paginationDto);
    }
};
exports.GetUserOrdersUseCase = GetUserOrdersUseCase;
exports.GetUserOrdersUseCase = GetUserOrdersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('OrderRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], GetUserOrdersUseCase);


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderSchema = exports.OrderDocument = exports.OrderItemSchema = exports.OrderItemDocument = void 0;
const mongoose_1 = __webpack_require__(4);
const enums_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(17);
let OrderItemDocument = class OrderItemDocument {
    productId;
    quantity;
    price;
};
exports.OrderItemDocument = OrderItemDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderItemDocument.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], OrderItemDocument.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], OrderItemDocument.prototype, "price", void 0);
exports.OrderItemDocument = OrderItemDocument = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderItemDocument);
exports.OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItemDocument);
let OrderDocument = class OrderDocument extends mongoose_2.Document {
    userId;
    items;
    totalAmount;
    status;
    createdAt;
};
exports.OrderDocument = OrderDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderDocument.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.OrderItemSchema], required: true }),
    __metadata("design:type", Array)
], OrderDocument.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], OrderDocument.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(enums_1.OrderStatus), default: enums_1.OrderStatus.PENDING }),
    __metadata("design:type", typeof (_a = typeof enums_1.OrderStatus !== "undefined" && enums_1.OrderStatus) === "function" ? _a : Object)
], OrderDocument.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], OrderDocument.prototype, "createdAt", void 0);
exports.OrderDocument = OrderDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'orders' })
], OrderDocument);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(OrderDocument);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("mongoose");

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongooseOrderRepository = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(17);
const order_schema_1 = __webpack_require__(16);
const order_mapper_1 = __webpack_require__(19);
let MongooseOrderRepository = class MongooseOrderRepository {
    orderModel;
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async save(order) {
        const persistenceData = order_mapper_1.OrderMapper.toPersistence(order);
        if (order.id && mongoose_2.Types.ObjectId.isValid(order.id)) {
            const updatedDoc = await this.orderModel
                .findByIdAndUpdate(order.id, persistenceData, { new: true })
                .exec();
            if (updatedDoc) {
                return order_mapper_1.OrderMapper.toDomain(updatedDoc);
            }
        }
        const createdDoc = new this.orderModel(persistenceData);
        const savedDoc = await createdDoc.save();
        return order_mapper_1.OrderMapper.toDomain(savedDoc);
    }
    async findByUserId(userId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const docs = await this.orderModel
            .find({ userId })
            .skip(skip)
            .limit(limit)
            .exec();
        return docs.map(doc => order_mapper_1.OrderMapper.toDomain(doc));
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await this.orderModel.findById(id).exec();
        if (!doc) {
            return null;
        }
        return order_mapper_1.OrderMapper.toDomain(doc);
    }
};
exports.MongooseOrderRepository = MongooseOrderRepository;
exports.MongooseOrderRepository = MongooseOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.OrderDocument.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MongooseOrderRepository);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderMapper = void 0;
const order_entity_1 = __webpack_require__(14);
class OrderMapper {
    static toDomain(document) {
        const domainItems = document.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        return new order_entity_1.Order(document._id.toString(), document.userId, domainItems, document.totalAmount, document.status, document.createdAt);
    }
    static toPersistence(domain) {
        return {
            userId: domain.userId,
            items: domain.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: domain.totalAmount,
            status: domain.status,
            createdAt: domain.createdAt,
        };
    }
}
exports.OrderMapper = OrderMapper;


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisProductServiceAdapter = void 0;
const common_1 = __webpack_require__(3);
const microservices_1 = __webpack_require__(5);
const rxjs_1 = __webpack_require__(21);
const enums_1 = __webpack_require__(7);
let RedisProductServiceAdapter = class RedisProductServiceAdapter {
    productsClient;
    constructor(productsClient) {
        this.productsClient = productsClient;
    }
    async reduceStock(items) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: enums_1.ProductPattern.REDUCE_STOCK }, { items }));
            return result;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.RedisProductServiceAdapter = RedisProductServiceAdapter;
exports.RedisProductServiceAdapter = RedisProductServiceAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCTS_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], RedisProductServiceAdapter);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("rxjs");

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
const orders_module_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(5);
const envs_1 = __webpack_require__(22);
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(orders_module_1.OrdersModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            host: envs_1.envs.redis.host,
            port: 6379,
        },
    });
    await app.listen();
    console.log('Microservicio Orders iniciado y escuchando en Redis...');
}
bootstrap();

})();

/******/ })()
;