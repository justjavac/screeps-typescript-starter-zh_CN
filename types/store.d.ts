/**
 * 一个代表了其存储中资源的对象。
 *
 * 游戏中有两种类型的 store：通用型 store 和限定型 store。
 *
 * - 通用型 store 可以储存任意类型的资源 (例如: creep, 容器(containers), 存储(storages), 终端(terminals))。
 *
 * - 限定型 store 只能储存该对象所需的几种特定资源 (例如: spawn, 拓展(extension), 实验室(lab), 核弹(nuker))。
 *
 * 两种 `Store` 的原型都是相同的，但是其返回值取决于调用方法时传入的 resource 参数。
 *
 * 你可以把资源的类型当做对象属性来获取对应的资源:
 *
 * ```js
 * console.log(creep.store[RESOURCE_ENERGY]);
 * ```
 */
interface StoreBase<POSSIBLE_RESOURCES extends ResourceConstant, UNLIMITED_STORE extends boolean> {
  /**
   * 返回指定资源的存储容量, 对于通用型 store，当 `reource` 参数为 `undefined` 则返回总容量。
   * @param resource 资源的类型
   * @returns 返回存储的数量, 当 `resource` 参数不是一个有效的存储类型时返回 `null`。
   */
  getCapacity<R extends ResourceConstant | undefined = undefined>(
    resource?: R
  ): UNLIMITED_STORE extends true
    ? null
    : R extends undefined
    ? ResourceConstant extends POSSIBLE_RESOURCES
      ? number
      : null
    : R extends POSSIBLE_RESOURCES
    ? number
    : null;
  /**
   * 返回指定资源已使用的容量, 若为通用型存储时, `reource` 参数为 `undefined` 则返回总使用容量。
   * @param resource 资源的类型
   * @returns 返回已使用的容量, 当 `resource` 参数不是一个有效的存储类型时返回 `null`。
   */
  getUsedCapacity<R extends ResourceConstant | undefined = undefined>(
    resource?: R
  ): R extends undefined
    ? ResourceConstant extends POSSIBLE_RESOURCES
      ? number
      : null
    : R extends POSSIBLE_RESOURCES
    ? number
    : null;
  /**
   * 返回该存储的剩余可用容量，对于限定型 store 来说，将在 `resource` 对该存储有效时返回该资源的剩余可用容量。
   * @param resource 资源的类型
   * @returns 返回可用的剩余容量，如果 resource 对该 store 无效则返回 null。
   */
  getFreeCapacity<R extends ResourceConstant | undefined = undefined>(
    resource?: R
  ): R extends undefined
    ? ResourceConstant extends POSSIBLE_RESOURCES
      ? number
      : null
    : R extends POSSIBLE_RESOURCES
    ? number
    : null;
}

type Store<POSSIBLE_RESOURCES extends ResourceConstant, UNLIMITED_STORE extends boolean> = StoreBase<
  POSSIBLE_RESOURCES,
  UNLIMITED_STORE
> &
  { [P in POSSIBLE_RESOURCES]: number } &
  { [P in Exclude<ResourceConstant, POSSIBLE_RESOURCES>]: 0 };

interface GenericStoreBase {
  /**
   * 返回指定资源的存储容量, 对于通用型 store，当 `reource` 参数为 `undefined` 则返回总容量。
   * @param resource 资源的类型
   * @returns 返回存储的数量, 当 `resource` 参数不是一个有效的存储类型时返回 `null`。
   */
  getCapacity(resource?: ResourceConstant): number | null;
  /**
   * 返回指定资源已使用的容量, 若为通用型存储时, `reource` 参数为 `undefined` 则返回总使用容量。
   * @param resource 资源的类型
   * @returns 返回已使用的容量, 当 `resource` 参数不是一个有效的存储类型时返回 `null`。
   */
  getUsedCapacity(resource?: ResourceConstant): number | null;
  /**
   * 返回该存储的剩余可用容量，对于限定型 store 来说，将在 `resource` 对该存储有效时返回该资源的剩余可用容量。
   * @param resource 资源的类型
   * @returns 返回可用的剩余容量，如果 resource 对该 store 无效则返回 null。
   */
  getFreeCapacity(resource?: ResourceConstant): number | null;
}

type GenericStore = GenericStoreBase & { [P in ResourceConstant]: number };
