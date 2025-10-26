# engine/ray.py
# Ray tracing simulation for box reflections

class Ray:
    """Ray with position and direction"""
    def __init__(self, pos, dir):
        self.pos = tuple(pos)
        self.dir = tuple(dir)
        # Normalize direction
        dx, dy, dz = dir
        mag = (dx*dx + dy*dy + dz*dz) ** 0.5
        if mag > 1e-12:
            self.dir = (dx/mag, dy/mag, dz/mag)
    
    def at(self, t):
        """Get position at parameter t"""
        return (
            self.pos[0] + t * self.dir[0],
            self.pos[1] + t * self.dir[1],
            self.pos[2] + t * self.dir[2]
        )

def run(ray, max_bounces):
    """
    Simulate ray bouncing inside unit cube [-1, 1]^3
    
    Returns:
        (final_ray, history)
    where history is list of (position, (axis, sign)) tuples
    """
    history = []
    pos = ray.pos
    dir = ray.dir
    
    for bounce in range(max_bounces):
        # Find next wall intersection
        t_min = float('inf')
        hit_axis = None
        hit_sign = None
        
        # Check each axis
        for axis in range(3):
            if abs(dir[axis]) > 1e-12:
                # Check positive wall
                t_pos = (1.0 - pos[axis]) / dir[axis]
                if t_pos > 1e-12 and t_pos < t_min:
                    t_min = t_pos
                    hit_axis = axis
                    hit_sign = 1
                
                # Check negative wall
                t_neg = (-1.0 - pos[axis]) / dir[axis]
                if t_neg > 1e-12 and t_neg < t_min:
                    t_min = t_neg
                    hit_axis = axis
                    hit_sign = -1
        
        if hit_axis is None:
            # No intersection (shouldn't happen in a closed box)
            break
        
        # Move to intersection point
        new_pos = [
            pos[0] + t_min * dir[0],
            pos[1] + t_min * dir[1],
            pos[2] + t_min * dir[2]
        ]
        
        # Clamp position to box boundaries to avoid numerical errors
        for i in range(3):
            if new_pos[i] > 1.0:
                new_pos[i] = 1.0
            elif new_pos[i] < -1.0:
                new_pos[i] = -1.0
        
        pos = tuple(new_pos)
        
        # Record bounce with axis name and sign
        axis_names = ['x', 'y', 'z']
        history.append((pos, (axis_names[hit_axis], hit_sign)))
        
        # Reflect direction
        new_dir = list(dir)
        new_dir[hit_axis] = -new_dir[hit_axis]
        dir = tuple(new_dir)
    
    final_ray = Ray(pos, dir)
    return final_ray, history
