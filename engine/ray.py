# engine/ray.py
"""
Ray tracing engine for simulation.
Implements basic ray tracing with bounce tracking in a confined space.
"""

# Constants for numerical stability
EPSILON = 1e-10  # Minimum threshold for direction component and collision time
COLLISION_TOLERANCE = 1e-6  # Tolerance for checking if collision point is within bounds


class Ray:
    """Represents a ray with position and direction."""
    
    def __init__(self, position, direction):
        """
        Initialize a ray.
        
        Args:
            position: tuple (x, y, z) representing ray origin
            direction: tuple (dx, dy, dz) representing normalized direction
        """
        self.position = position
        self.direction = direction
    
    def __repr__(self):
        return f"Ray(pos={self.position}, dir={self.direction})"


def run(ray, max_bounces):
    """
    Run ray tracing simulation with bounces.
    
    Args:
        ray: Ray object with initial position and direction
        max_bounces: Maximum number of bounces to simulate
    
    Returns:
        tuple: (final_ray, history)
            final_ray: Ray object after all bounces
            history: list of (position, side) tuples where side is (axis, sign)
    """
    history = []
    pos = list(ray.position)
    direction = list(ray.direction)
    
    # Simulation bounds (cube from -1 to 1)
    bounds = 1.0
    
    for bounce in range(max_bounces):
        # Find time to next wall collision
        t_min = float('inf')
        hit_axis = None
        hit_sign = None
        
        for axis in range(3):
            if abs(direction[axis]) > EPSILON:
                # Check collision with positive and negative walls
                for sign in [1, -1]:
                    wall_pos = sign * bounds
                    t = (wall_pos - pos[axis]) / direction[axis]
                    
                    if t > EPSILON and t < t_min:
                        # Check if collision point is within bounds for other axes
                        collision_point = [pos[i] + t * direction[i] for i in range(3)]
                        valid = True
                        for other_axis in range(3):
                            if other_axis != axis:
                                if abs(collision_point[other_axis]) > bounds + COLLISION_TOLERANCE:
                                    valid = False
                                    break
                        
                        if valid:
                            t_min = t
                            hit_axis = axis
                            hit_sign = sign
        
        if hit_axis is None:
            # No collision found, break
            break
        
        # Move ray to collision point
        for i in range(3):
            pos[i] += t_min * direction[i]
        
        # Record bounce
        axis_names = ['x', 'y', 'z']
        history.append((tuple(pos), (axis_names[hit_axis], hit_sign)))
        
        # Reflect direction at wall
        direction[hit_axis] = -direction[hit_axis]
    
    final_ray = Ray(tuple(pos), tuple(direction))
    return final_ray, history
