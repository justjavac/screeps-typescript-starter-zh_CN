/**
 * 死亡creep的遗物。这个对象不阻碍行走。
 * <ul>
 *     <li>消失: 死去的 creep 每个身体部件 5 tick</li>
 * </ul>
 */
interface Tombstone extends RoomObject {
  /**
   * 一个唯一的对象标识。你可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * 死亡时间。
   */
  deathTime: number;
  /**
   * 一个表示该结构所存储资源的 [`Store`](https://screeps-cn.github.io/api/#Store) 对象。
   */
  store: StoreDefinitionUnlimited;
  /**
   * 这个墓碑消失的剩余时间。
   */
  ticksToDecay: number;
  /**
   * 一个内含死亡 creep 或超能 creep 的对象。
   */
  creep: AnyCreep;
}

interface TombstoneConstructor extends _Constructor<Tombstone>, _ConstructorById<Tombstone> {}

declare const Tombstone: TombstoneConstructor;
