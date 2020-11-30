import { ErrorMapper } from "utils/ErrorMapper";

import { roleBuilder } from "role/builder";
import { roleHarvester } from "role/harvester";
import { roleUpgrader } from "role/upgrader";

export const loop = ErrorMapper.wrapLoop(() => {
  const tower = Game.getObjectById("TOWER_ID" as Id<StructureTower>);
  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.hits < structure.hitsMax
    });
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === "harvester");
  if (harvesters.length < 2) {
    const name = `H${Date.now() % 1000}`;
    const opts = { memory: { role: "harvester" } };
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], name, opts as any);
  }

  const upgraders = _.filter(Game.creeps, creep => creep.memory.role === "upgrader");
  if (upgraders.length < 2) {
    const name = `U${Date.now() % 1000}`;
    const opts = { memory: { role: "upgrader" } };
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], name, opts as any);
  }

  const builders = _.filter(Game.creeps, creep => creep.memory.role === "builder");
  if (builders.length < 2) {
    const name = `B${Date.now() % 1000}`;
    const opts = { memory: { role: "builder" } };
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], name, opts as any);
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === "builder") {
      roleBuilder.run(creep);
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
