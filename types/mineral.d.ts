/**
 * 矿床。在建有 extractor 建筑时可以通过带有 `WORK` 身体部件的 creep 采集。
 * @see https://screeps-cn.github.io/resources.html
 */
interface Mineral<T extends MineralConstant = MineralConstant> extends RoomObject {
  /**
   * The prototype is stored in the Mineral.prototype global object. You can use it to extend game objects behaviour globally.
   */
  readonly prototype: Mineral;
  /**
   * 矿床丰度。丰度越高其容量越大。一旦再生时间 (ticksToRegeneration) 降为 `0`，该矿床的丰度将被重置为 `DENSITY_*` 常量之一。
   */
  density: number;
  /**
   * 资源的剩余容量。
   */
  mineralAmount: number;
  /**
   * 资源类型，`RESOURCE_*` 常量之一。
   */
  mineralType: T;
  /**
   * 一个唯一的对象标识。你可以使用 `Game.getObjectById` 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * 矿床容量将要恢复满额的剩余时间。
   */
  ticksToRegeneration: number;
}

interface MineralConstructor extends _Constructor<Mineral>, _ConstructorById<Mineral> {}

declare const Mineral: MineralConstructor;
