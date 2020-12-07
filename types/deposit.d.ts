/**
 * 生产商品所需的稀有资源储备。可以通过带有 `WORK` 身体部位的 creep 来收获。
 * 每次采集操作都会触发冷却时间，冷却时间会随着时间的流逝而越来越长。
 *
 * 点击 [本文](https://screeps-cn.github.io/resources.html) 了解更多关于 deposits 的信息。
 */
interface Deposit extends RoomObject {
  /**
   * 唯一的对象标识符。
   *
   * 您可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法通过其 id 检索对象实例。
   */
  id: Id<this>;
  /**
   * deposit 类型, 以下常量之一: `RESOURCE_MIST`, `RESOURCE_BIOMASS`, `RESOURCE_METAL`, `RESOURCE_SILICON`
   */
  depositType: DepositConstant;
  /**
   * 下一次采集前还要冷却多少 tick。
   */
  cooldown: number;
  /**
   * 该结构上次采集的冷却时间。
   */
  lastCooldown: number;
  /**
   * 该结构还有多少 tick 就要因老化而消失。
   */
  ticksToDecay: number;
}

interface DepositConstructor extends _Constructor<Deposit>, _ConstructorById<Deposit> {}

declare const Deposit: DepositConstructor;
