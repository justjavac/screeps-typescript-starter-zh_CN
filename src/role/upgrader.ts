/**
 * 升级者。
 *
 * 当把 creep 的 `role` 设置为 `"upgrader"` 时，creep 在每个 tick 会执行 `roleUpgrader.run` 代码。
 *
 * ```ts
 * Game.creeps['name'].memory.role = 'upgrader';
 * ```
 *
 * creep 会找到控制器 (room controller) 并进行升级。当 creep 在携带的能量（energy）变为 0 时去采集能量，并在采集到足够能量之后回到控制器附近继续升级。
 */
export const roleUpgrader = {
  run(creep: Creep): void {
    // 如果当前 creep 正在升级但是没有能量了，则让此 creep 去采集能量
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 采集");
    }

    // 如果当前 creep 不处于升级模式，并且能量已经存满，则让此 creep 去升级
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ 升级");
    }

    if (creep.memory.upgrading) {
      if (creep.room.controller == null) {
        console.log("房间 %s 中没有控制器", creep.room.name);
      } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};
