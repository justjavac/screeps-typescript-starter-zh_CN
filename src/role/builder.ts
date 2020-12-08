/**
 * 建筑工。
 *
 * 当把 creep 的 `role` 设置为 `"builder"` 时，creep 在每个 tick 会执行 `roleBuilder.run` 代码。
 *
 * ```ts
 * Game.creeps['name'].memory.role = 'builder';
 * ```
 *
 * creep 会找到建造点 (construction site) 并进行建造。当 creep 在携带的能量（energy）变为 0 时去采集能量，并在采集到足够能量之后回到建造场地。
 */
export const roleBuilder = {
  run(creep: Creep): void {
    // 如果当前 creep 正在建造但是没有能量了，则让此 creep 去采集能量
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("🔄 采集");
    }

    // 如果当前 creep 不处于建造模式，并且能量已经存满，则让此 creep 去建造
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("🚧 建造");
    }

    if (creep.memory.building) {
      // 在 creep 所在房间中找到所有的建筑工地
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};
