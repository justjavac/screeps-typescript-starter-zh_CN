/**
 * 一个能量源对象。可以被拥有 `WORK` 身体部件的 creep 采集。
 */
interface Source extends RoomObject {
  /**
   * The prototype is stored in the Source.prototype global object. You can use it to extend game objects behaviour globally:
   */
  readonly prototype: Source;
  /**
   * 能量的剩余容量。
   */
  energy: number;
  /**
   * 该 source 的总能量容量。
   */
  energyCapacity: number;
  /**
   * 一个唯一的对象标识。你可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * 如果你可以获得一个 Source 的实例，那么你就可以看到这个实例。
   * 如果你能看到某个 Source，那么你就可以看到它所在的 room。
   */
  room: Room;
  /**
   * 该 source 还有多少 tick 将会再生。
   */
  ticksToRegeneration: number;
}

interface SourceConstructor extends _Constructor<Source>, _ConstructorById<Source> {}

declare const Source: SourceConstructor;
