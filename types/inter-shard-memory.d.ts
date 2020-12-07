/**
 * `InterShardMemory` 对象提供了在不同的 shard 之间通信的接口。你的脚本在不同的 shard 内是单独执行的，并且他们的 `Memory` 对象对彼此隔离。
 * 为了在不同的 shard 之间传递信息，您需要使用 `InterShardMemory`。
 *
 * 每个 shard 可以拥有能被其他 shard 访问的数据字符串。每个数据字符串只有其所属的 shard 才有写权限， 而其他的 shard 只有读权限。
 *
 * 该数据和 `Memory` 完全不相关，它是一个独立的数据容器。
 */
interface InterShardMemory {
  /**
   * 返回当前 shard 的数据字符串内容。
   */
  getLocal(): string;
  /**
   * 将当前 shard 的数据替换为新的值。
   * @param value 格式化为字符串的新数据。
   */
  setLocal(value: string): void;
  /**
   * 返回其他 shard 的数据字符串内容。
   *
   * @param shard Shard 名称。
   * @throws Error if shard name is invalid
   */
  getRemote(shard: string): string | null;
}

declare const InterShardMemory: InterShardMemory;
