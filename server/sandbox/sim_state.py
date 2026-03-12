import math

sticker_whitelist = [
  'person', 'bird', 'bear', 'bench', 'donut', 'horse', 'zebra', 'giraffe', 'elephant', 'dog', 'cat', 'cow', 'sheep', 'restaurant', 'cellphone'
]

class SimState:
  def __init__(self, grid):
    self.size_x = grid["size_x"]
    self.size_z = grid["size_z"]
    self.finish = grid.get("finish")
    self.barriers = set(grid.get("barriers", []))
    self.stickers = {s["index"]: s["sticker"] for s in grid.get("stickers", [])}

    start = grid.get("start", 0)
    self.x = math.trunc(start / self.size_z)
    self.z = start % self.size_z
    self.direction = grid.get("start_rotation", 0)

  def _delta(self):
    return {
      0: (0, 1),
      90: (1, 0),
      180: (0, -1),
      270: (-1, 0),
    }[self.direction]

  def move_forward(self):
    dx, dz = self._delta()
    nx, nz = self.x + dx, self.z + dz
    if self._is_valid(nx, nz):
      self.x, self.z = nx, nz
      return True
    return False

  def move_backward(self):
    dx, dz = self._delta()
    nx, nz = self.x - dx, self.z - dz
    if self._is_valid(nx, nz):
      self.x, self.z = nx, nz
      return True
    return False

  def rotate_left(self):
    self.direction = (self.direction + 90) % 360

  def rotate_right(self):
    self.direction = (self.direction - 90) % 360

  def get_tile_ahead(self):
    dx, dz = self._delta()
    ahead_x, ahead_z = self.x + dx, self.z + dz
    if not self._in_bounds(ahead_x, ahead_z):
      # return {"type": "out_of_bounds"}
      return ""
    index = ahead_x * self.size_z + ahead_z
    if index in self.barriers:
      return {"type": "barrier"}
    if index in self.stickers:
      if self.stickers[index] in sticker_whitelist:
        return self.stickers[index]
    # return {"type": "empty"}
    return ""

  def current_index(self):
    return self.x * self.size_z + self.z

  def is_finished(self):
    return self.current_index() == self.finish

  def _in_bounds(self, x, z):
    return 0 <= x < self.size_x and 0 <= z < self.size_z

  def _is_valid(self, x, z):
    if not self._in_bounds(x, z):
      return False
    return (x * self.size_z + z) not in self.barriers