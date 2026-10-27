import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_gradient_surface(width, height, color1, color2):
    """Creates a diagonal linear gradient from color1 to color2."""
    base = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    for y in range(height):
        for x in range(width):
            # Diagonal gradient factor from 0.0 to 1.0
            factor = (x / width * 0.5) + (y / height * 0.5)
            factor = max(0.0, min(1.0, factor))
            r = int(color1[0] + factor * (color2[0] - color1[0]))
            g = int(color1[1] + factor * (color2[1] - color1[1]))
            b = int(color1[2] + factor * (color2[2] - color1[2]))
            a = 255
            base.putpixel((x, y), (r, g, b, a))
    return base

def draw_squircle_mask(size, radius):
    """Draws a smooth anti-aliased rounded rectangle mask."""
    # Render at 4x resolution for perfect anti-aliasing
    scale = 4
    high_size = size * scale
    high_radius = radius * scale
    mask = Image.new('L', (high_size, high_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, high_size - 1, high_size - 1], radius=high_radius, fill=255)
    return mask.resize((size, size), Image.Resampling.LANCZOS)

def generate_auralms_icon(size=512, is_maskable=False):
    # Render at 2x resolution then downscale for super crisp edges
    render_size = 1024
    
    # Colors
    c_start = (99, 102, 241)   # #6366F1
    c_end = (55, 48, 163)     # #3730A3
    c_cyan = (56, 189, 248)    # #38BDF8
    c_indigo = (129, 140, 248) # #818CF8
    
    # 1. Base gradient
    base = create_gradient_surface(render_size, render_size, c_start, c_end)
    
    # 2. If not maskable, apply squircle clipping mask
    if not is_maskable:
        mask = draw_squircle_mask(render_size, int(render_size * 0.22))
        icon = Image.new('RGBA', (render_size, render_size), (0, 0, 0, 0))
        icon.paste(base, (0, 0), mask)
    else:
        icon = base
        
    draw = ImageDraw.Draw(icon)
    
    # 3. Subtle inner border for non-maskable
    if not is_maskable:
        border_radius = int(render_size * 0.21)
        border_inset = int(render_size * 0.02)
        draw.rounded_rectangle(
            [border_inset, border_inset, render_size - border_inset, render_size - border_inset],
            radius=border_radius,
            outline=(255, 255, 255, 35),
            width=int(render_size * 0.01)
        )
        
    # 4. Layered Prism Logo Geometry
    # Safe zone scaling: if maskable, scale to 70% to guarantee center within safe circle
    scale_factor = 0.65 if is_maskable else 0.85
    cx = render_size / 2
    cy = render_size / 2
    
    # Create separate high-res layer for prisms and shadows
    prism_layer = Image.new('RGBA', (render_size, render_size), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(prism_layer)
    
    # Helper to transform centered coordinates
    def pt(x, y):
        return (cx + (x - 256) * scale_factor * 2, cy + (y - 256) * scale_factor * 2)
        
    # Prism coordinates (based on 512x512 canvas center):
    # Top diamond:
    top_poly = [pt(256, 140), pt(366, 204), pt(256, 268), pt(146, 204)]
    
    # Middle shelf:
    mid_top = [pt(146, 250), pt(256, 314), pt(366, 250)]
    mid_bot = [pt(366, 286), pt(256, 350), pt(146, 286)]
    mid_poly = mid_top + mid_bot
    
    # Base shelf:
    base_top = [pt(146, 332), pt(256, 396), pt(366, 332)]
    base_bot = [pt(366, 368), pt(256, 432), pt(146, 368)]
    base_poly = base_top + base_bot
    
    # Draw Drop Shadow behind Prisms
    shadow_layer = Image.new('RGBA', (render_size, render_size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    s_offset = int(24 * scale_factor)
    
    def pt_s(x, y):
        return (cx + (x - 256) * scale_factor * 2, cy + (y - 256) * scale_factor * 2 + s_offset)
        
    s_draw.polygon([pt_s(256, 140), pt_s(366, 204), pt_s(256, 268), pt_s(146, 204)], fill=(20, 15, 60, 100))
    s_draw.polygon([pt_s(146, 250), pt_s(256, 314), pt_s(366, 250), pt_s(366, 286), pt_s(256, 350), pt_s(146, 286)], fill=(20, 15, 60, 100))
    s_draw.polygon([pt_s(146, 332), pt_s(256, 396), pt_s(366, 332), pt_s(366, 368), pt_s(256, 432), pt_s(146, 368)], fill=(20, 15, 60, 100))
    
    shadow_blur = shadow_layer.filter(ImageFilter.GaussianBlur(radius=int(28 * scale_factor)))
    icon = Image.alpha_composite(icon, shadow_blur)
    
    # Draw Prisms
    # Base shelf
    p_draw.polygon(base_poly, fill=(224, 231, 255, 215))
    
    # Middle shelf
    p_draw.polygon(mid_poly, fill=(255, 255, 255, 245))
    
    # Top diamond (gradient simulation: cyan-to-indigo)
    p_draw.polygon(top_poly, fill=(56, 189, 248, 255))
    # Top highlight
    hl_poly = [pt(256, 140), pt(366, 204), pt(256, 204)]
    p_draw.polygon(hl_poly, fill=(129, 140, 248, 160))
    
    icon = Image.alpha_composite(icon, prism_layer)
    
    # Resize down to requested size with high quality Lanczos filter
    final_icon = icon.resize((size, size), Image.Resampling.LANCZOS)
    return final_icon

def main():
    target_dir = os.path.join(os.path.dirname(__file__), '..', 'client', 'public')
    os.makedirs(target_dir, exist_ok=True)
    
    print('[IconGen] Generating 512x512 PWA app icon...')
    icon_512 = generate_auralms_icon(512, is_maskable=False)
    icon_512.save(os.path.join(target_dir, 'pwa-512x512.png'), 'PNG')
    
    print('[IconGen] Generating 192x192 PWA app icon...')
    icon_192 = generate_auralms_icon(192, is_maskable=False)
    icon_192.save(os.path.join(target_dir, 'pwa-192x192.png'), 'PNG')
    
    print('[IconGen] Generating 512x512 Maskable PWA app icon (safe-area centered)...')
    icon_maskable = generate_auralms_icon(512, is_maskable=True)
    icon_maskable.save(os.path.join(target_dir, 'maskable-icon-512x512.png'), 'PNG')
    
    print('[IconGen] Generating 180x180 Apple Touch Icon...')
    icon_apple = generate_auralms_icon(180, is_maskable=False)
    icon_apple.save(os.path.join(target_dir, 'apple-touch-icon.png'), 'PNG')
    
    print('[IconGen] Generating 32x32 Favicon...')
    icon_32 = generate_auralms_icon(32, is_maskable=False)
    icon_32.save(os.path.join(target_dir, 'favicon-32x32.png'), 'PNG')
    
    print('[IconGen] Generating 16x16 Favicon...')
    icon_16 = generate_auralms_icon(16, is_maskable=False)
    icon_16.save(os.path.join(target_dir, 'favicon-16x16.png'), 'PNG')
    
    print('[IconGen] Generating multi-size favicon.ico...')
    icon_512.save(
        os.path.join(target_dir, 'favicon.ico'),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )
    
    print('[IconGen] All PWA app icons generated successfully in client/public!')

if __name__ == '__main__':
    main()
