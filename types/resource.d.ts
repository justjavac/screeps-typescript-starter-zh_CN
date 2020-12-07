/**
 * 掉落的资源。 如果没有拿起，它会在一段时间后消失。 掉落的资源以每 tick `ceil(amount/1000)` 的速度消失。
 */
interface Resource<T extends ResourceConstant = ResourceConstant> extends RoomObject {
  readonly prototype: Resource;

  /**
   * 资源数量。
   */
  amount: number;
  /**
   * 一个唯一的对象标识。你可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * `RESOURCE_*` 常量之一。
   */
  resourceType: T;
}

interface ResourceConstructor extends _Constructor<Resource>, _ConstructorById<Resource> {}

declare const Resource: ResourceConstructor;
