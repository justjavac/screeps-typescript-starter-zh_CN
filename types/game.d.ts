/**
 * 包含所有游戏信息的主要全局游戏对象。
 */
interface Game {
  /**
   * 包含有关 CPU 使用率信息的对象：
   */
  cpu: CPU;
  /**
   * 包含你所有 creep 的 hash，并以 creep 名作为关键字。
   */
  creeps: { [creepName: string]: Creep };
  /**
   * 包含你所有 flag 的 hash，以 flag 名作为关键字。
   */
  flags: { [flagName: string]: Flag };
  /**
   * 你的[全局控制等级（Global Control Level）](https://screeps-cn.github.io/control.html#Global-Control-Level)的对象，具有以下属性：
   *
   * 参数 | 类型 | 描述
   * :---- | :--- | :-----
   * level | `number` | 当前的等级。
   * progress | `number` | 到下一个等级当前的进展。
   * progressTotal | `number` | 到下一个等级所需的进展。
   */
  gcl: GlobalControlLevel;
  /**
   * 你的全局能量等级（Global Power Level）的对象，具有以下属性：
   *
   * 参数 | 类型 | 描述
   * :---- | :--- | :-----
   * level | `number` | 当前的等级。
   * progress | `number` | 到下一个等级当前的进展。
   * progressTotal | `number` | 到下一个等级所需的进展。
   */
  gpl: GlobalPowerLevel;
  /**
   * 表示世界地图的全局对象。请参照此[文档](https://screeps-cn.github.io/api/#Game-map)。
   */
  map: GameMap;
  /**
   * 表示游戏内市场的全局对象。请参照此[文档](https://screeps-cn.github.io/api/#Game-market)。
   */
  market: Market;
  /**
   * 包含你所有超能 creep 的 hash，以 creep 名称为键。从这里也可以访问到未孵化的超能 creep。
   */
  powerCreeps: { [creepName: string]: PowerCreep };
  /**
   * 表示你账户中全局资源的对象，例如 pixel 或 cpu unlock。每个对象的关键字都是一个资源常量，值是资源量。
   */
  resources: { [key: string]: any };
  /**
   * 包含所有对你可用的房间的 hash，以房间名作为关键字。一个房间在你有一个 creep 或者自有建筑在其中时可见。
   */
  rooms: { [roomName: string]: Room };
  /**
   * 包含你所有 spawn 的 hash，以 spawn 名作为关键字。
   */
  spawns: { [spawnName: string]: StructureSpawn };
  /**
   * 包含你所有 structures 的 hash，以 structures 名作为关键字。
   */
  structures: { [structureId: string]: Structure };

  /**
   * 包含你所有施工工地的 hash，并以 id 作为关键字。
   */
  constructionSites: { [constructionSiteId: string]: ConstructionSite };

  /**
   * 表示当前正在执行脚本的 shard 的对象。
   */
  shard: Shard;

  /**
   * 系统游戏 tick 计数。他在每个 tick 自动递增。点此[了解更多](https://screeps-cn.github.io/game-loop.html)。
   */
  time: number;

  /**
   * 获取具有唯一指定 ID 的对象。 它可以是任何类型的游戏对象。 只能访问您可见的房间内的物体。
   * @param id The unique identifier.
   * @returns 返回一个对象实例，若找不到则返回 `null`。
   */
  getObjectById<T>(id: Id<T>): T | null;

  /**
   * 获取具有唯一指定 ID 的对象。 它可以是任何类型的游戏对象。 只能访问您可见的房间内的物体。
   * @param id The unique identifier.
   * @returns 返回一个对象实例，若找不到则返回 `null`。
   * @deprecated Use `Id<T>`, instead of strings, to increase type safety
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  getObjectById<T>(id: string): T | null;

  /**
   * 向你的个人资料中的邮件发送信息。
   *
   * 由此，你可以在游戏中的任何场合为自己设置通知
   *
   * 你最多可以安排 20 个通知。在模拟模式中不可用。
   *
   * @param 将在消息中发送的自定义文本。最大长度为 `1000` 个字符。
   * @param 如果被设为 `0` (默认), 通知将被立即安排。否早他将于其他通知编组，并在指定的时间（分钟）寄出。
   */
  notify(message: string, groupInterval?: number): undefined;
}

declare let Game: Game;
