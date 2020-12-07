/**
 * 描述游戏内市场的全局变量。您可以使用该对象追踪从您的终端接收/发送的资源交易，以及您的购买/出售订单。
 * @see https://screeps-cn.github.io/market.html
 */
interface Market {
  /**
   * 您当前的 credit 余额。
   */
  credits: number;
  /**
   * 一个数组，内容为您终端接收的最近 100 笔交易
   */
  incomingTransactions: Transaction[];
  /**
   * 一个对象，包含了您在市场中活跃 (activated) 和非活跃 (deactivated) 的购买/出售订单。
   */
  orders: { [key: string]: Order };
  /**
   * 一个数组，内容为您终端发送的最近 100 笔交易
   */
  outgoingTransactions: Transaction[];
  /**
   * 估算 `StructureTerminal.send` 和 `Game.market.deal` 方法的能量交易成本。 算法：
   *
   * ```js
   * Math.ceil( amount * (Math.log(0.1*linearDistanceBetweenRooms + 0.9) + 0.1) )
   * ```
   *
   * @param amount 要发送的资源数量。
   * @param roomName1 第一个房间的名称。
   * @param roomName2 第二个房间的名称。
   * @returns 进行交易所需的能量。
   */
  calcTransactionCost(amount: number, roomName1: string, roomName2: string): number;
  /**
   * 取消先前创建的订单。5% 的费用将不予退还。
   * @param orderId `Game.market.orders` 中提供的订单 ID。
   * @returns `OK`, `ERR_INVALID_ARGS`
   */
  cancelOrder(orderId: string): ScreepsReturnCode;
  /**
   * 修改一个已存在订单的单价。如果 `newPrice` 大于之前的单价，将向您收取 `(newPrice - oldPrice) * remainingAmount * 0.05` credit 的费用。
   * @param orderId `Game.market.orders` 提供的订单 ID。
   * @param newPrice 新的订单单价。
   * @returns `OK`, `ERR_NOT_OWNER`, `ERR_NOT_ENOUGH_RESOURCES`, `ERR_INVALID_ARGS`
   */
  changeOrderPrice(orderId: string, newPrice: number): ScreepsReturnCode;
  /**
   * 从您的终端创建一个市场订单。下单时将向您收取 `price * amount * 0.05` credit 的费用。
   *
   * 每个玩家最多可以拥有 300 个订单。您可以在任意时刻使用任意数量创建一个订单。之后会自动根据其可用资源量和 credit 来将其状态设置为活跃和非活跃。
   *
   * An order expires in 30 days after its creation, and the remaining market fee is returned.
   */
  createOrder(params: {
    type: ORDER_BUY | ORDER_SELL;
    resourceType: MarketResourceConstant;
    price: number;
    totalAmount: number;
    roomName?: string;
  }): ScreepsReturnCode;
  /**
   * 使用 `yourRoomName` 房间中的终端处理一个贸易订单，根据订单类型(购入/卖出)来和其他玩家的终端进行交易。
   *
   * 无论订单类型如何，您的终端都将承担本次资源交易所产生的能量消耗。您可以使用 `Game.market.calcTransactionCost` 方法估算运输成本。
   * 当多个玩家尝试处理同一个订单时，距离更近的玩家优先。您每 tick 不能处理超过 10 笔交易。
   * @param orderId 来自 `Game.market.getAllOrders` 的订单 ID。
   * @param amount 要转移的资源数量。
   * @param targetRoomName 您的某个房间名称，该房间应该存在有包含足够能量的可用终端。当订单的资源类型为 `SUBSCRIPTION_TOKEN` 时无需填写该参数。
   */
  deal(orderId: string, amount: number, targetRoomName?: string): ScreepsReturnCode;
  /**
   * 为一个已存在的订单添加容量。它将影响 `remainingAmount` 和 `totalAmount` 属性。您将要为此支付 `price * addAmount * 0.05` credit 的手续费。
   * @param orderId `Game.market.orders` 中提供的订单 ID。
   * @param addAmount 要增加多少容量。不能为负数。
   * @returns `OK`, `ERR_NOT_ENOUGH_RESOURCES`, `ERR_INVALID_ARGS`
   */
  extendOrder(orderId: string, addAmount: number): ScreepsReturnCode;
  /**
   * 获取当前市场上其他玩家活跃的订单。该方法支持 `resourceType` 内置索引。
   * @param filter (optional) 一个对象或者函数，将使用 `_.filter` 方法对结果列表进行筛选。
   */
  getAllOrders(filter?: OrderFilter | ((o: Order) => boolean)): Order[];
  /**
   * 获取最近 14 天以来市场中指定资源的每日价格记录。
   * @param resource `RESOURCE_*` 常量之一。如果为 `undefined`，则返回所有资源的历史数据。
   */
  getHistory(resource?: MarketResourceConstant): PriceHistory[];
  /**
   * 检索指定的市场订单。
   * @param orderId 订单 ID。
   */
  getOrderById(id: string): Order | null;
}

// No static is available

interface Transaction {
  transactionId: string;
  time: number;
  sender?: { username: string };
  recipient?: { username: string };
  resourceType: MarketResourceConstant;
  amount: number;
  from: string;
  to: string;
  description: string;
  order?: TransactionOrder;
}

interface Order {
  /** 唯一的订单 ID。 */
  id: string;
  /** 订单创建时的游戏 tick。inter-shard 市场中的订单不存在该属性。 */
  created: number;
  active?: boolean;
  /** `ORDER_SELL` 或 `ORDER_BUY`。 */
  type: string;
  /** ` RESOURCE_*` 常量之一或者 `SUBSCRIPTION_TOKEN`。 */
  resourceType: MarketResourceConstant;
  /** 下订单的房间。 */
  roomName?: string;
  /** 当前可用的交易量。 */
  amount: number;
  /** 该订单还可以交易多少资源。 */
  remainingAmount: number;
  totalAmount?: number;
  /** 当前的交易单价。 */
  price: number;
}

interface TransactionOrder {
  id: string;
  type: string;
  price: number;
}

interface OrderFilter {
  id?: string;
  created?: number;
  type?: string;
  resourceType?: MarketResourceConstant;
  roomName?: string;
  amount?: number;
  remainingAmount?: number;
  price?: number;
}

interface PriceHistory {
  resourceType: MarketResourceConstant;
  date: string;
  transactions: number;
  volume: number;
  avgPrice: number;
  stddevPrice: number;
}
